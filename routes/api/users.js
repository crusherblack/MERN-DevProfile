const express = require('express');
const router = express.Router(); //init router
const { check, validationResult } = require('express-validator'); //import validator
const gravatar = require('gravatar'); //import gravatar
const bcrypt = require('bcryptjs'); //import bcrypt
const jwt = require('jsonwebtoken'); //import jsonwebtoken
const config = require('config'); //import config

//import model User
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
	'/',
	[
		check('name', 'Inputkan Nama').not().isEmpty(),
		check('email', 'Inputkan email yang valid').isEmail(),
		check('password', 'Inputkan 6 karakter atau lebih').isLength({ min: 6 })
	], //validator dari express
	async (req, res) => {
		const errors = validationResult(req);
		//jika ada error maka
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { name, email, password } = req.body; //bisa juga pake req.body.name,req.body.email,req.body.password

		try {
			//Cek apakah user sudah terdaftar maka
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'User sudah ada gunakan email yang lain'
						}
					] //cocokkan dengan error pada validator
				});
			}

			//Get user gravatar || cek dokumentasi gravatar untuk selengkapnya
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			//inialisasi variable user diatas
			user = new User({
				name,
				email,
				avatar,
				password
			});

			//Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			//Simpan user
			await user.save();

			//Return JSON Webtoken agar bisa login langsung setelah register
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
