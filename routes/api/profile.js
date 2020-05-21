const express = require('express');
const router = express.Router(); //init router

// @route   GET api/profile
// @desc    Test Route
// @access  Public
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;
