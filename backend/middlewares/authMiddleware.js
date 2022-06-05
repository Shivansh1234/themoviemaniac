const jwt = require('jsonwebtoken');
const APIError = require('../config/APIError');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Get token from Header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);// Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (e) {
            next(APIError.unauthorized('Token unformatted'));
            return;
        }

    } else {
        next(APIError.unauthorized('User unauthorized'));
        return;
    }
    if (!token) {
        next(APIError.unauthorized('Unauthorized access, no token'));
        return;
    }
}

module.exports = { protect };