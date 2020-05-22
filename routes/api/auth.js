const express = require('express');
const router = express.Router(); //init router
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator'); //import validator
const config = require('config'); //import config
const jwt = require('jsonwebtoken'); //import jsonwebtoken
const bcrypt = require('bcryptjs'); //import bcrypt

//import model
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get Data
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/auth
// @desc    Autheticate User and get token
// @access  Public
router.post(
	'/',
	[
		check('email', 'Inputkan email yang valid').isEmail(),
		check('password', 'Inputkan password yang valid').exists()
	], //validator dari express
	async (req, res) => {
		const errors = validationResult(req);
		//jika ada error maka
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { email, password } = req.body; //bisa juga pake req.body.email,req.body.password

		try {
			//Cek apakah user sudah terdaftar maka
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid Credentials'
						}
					] //cocokkan dengan error pada validator
				});
			}

			//compare password dengan hash dengan data user pada database
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid Credentials'
						}
					] //cocokkan dengan error pada validator
				});
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error('err.message');
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
