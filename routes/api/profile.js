const express = require('express');
const router = express.Router(); //init router
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator'); //import validator

//import model User
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
			'name',
			'avatar'
		]); //get profile berdasarkan user login dan join user model
		if (!profile) {
			return res.status(400).json({
				msg: 'There is no profile for this user'
			});
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/profile/
// @desc    Create or update profile
// @access  Private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body;

		// Build Profile Object
		const profileFields = {};
		profileFields.user = req.user.id;

		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((skill) => skill.trim());
		}

		//Build Social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				//Update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);
				return res.json(profile);
			}

			//Create
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   GET api/profile/
// @desc    Get all profile
// @access  Public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [ 'name', 'avatar' ]);
		res.json(profiles);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server Error');
	}
});

// @route   GET api/profile/user/user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate('user', [ 'name', 'avatar' ]);
		if (!profile) return res.status(400).json({ msg: 'Profile Not Found' });

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		if (error.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/profile/
// @desc    Delete profile and user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
	try {
		//@todo - remove user post
		//remove spesific profile
		await Profile.findOneAndRemove({ user: req.user.id });
		//remove spesific user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: 'user deleted' });
	} catch (error) {
		console.error(error.message);
		if (error.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { title, company, location, from, to, current, description } = req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('filedofstudy', 'Filed Of Study is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { school, degree, filedofstudy, from, to, current, description } = req.body;

		const newEdu = {
			school,
			degree,
			filedofstudy,
			from,
			to,
			current,
			description
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);
		profile.education.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   GET api/profile/github/:username
// @desc    Get User Repo from github
// @access  Public
router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${req.params
				.username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' }
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);
			if (response.statusCode !== 200) {
				return res.status(404).json({
					msg: 'No Github Profile Found'
				});
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
