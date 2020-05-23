const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
	// Get Token from header
	const token = req.header('x-auth-token');

	// Check jika token gak ada
	if (!token) {
		return res.status(401).json({
			msg: 'No Token, Atuhorization Denied'
		});
	}

	// Verify Token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		//set request user ketika login
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({
			msg: 'Token is not valid'
		});
	}
};
