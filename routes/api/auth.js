const express = require('express');
const router = express.Router(); //init router

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', (req, res) => res.send('Auth Route'));

module.exports = router;
