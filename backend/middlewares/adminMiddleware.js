const APIError = require("../config/APIError");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminProtect = async (req, res, next) => {
    let adminToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Get token from header
        adminToken = req.headers.authorization.split(' ')[1];

        // Verify token
        try {
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET); // Getting user data from token
            req.user = await User.findById(decoded.id).select('-password');

            // Verify if token coming from admin
            if (decoded.isAdmin) {
                next();
            } else {
                next(APIError.unauthorized('Unauthorized Admin access'));
            }
        } catch (err) {
            next(APIError.badRequest('Token unformatted'));
            return;
        }

    } else {
        next(APIError.badRequest('Unauthorized access, no token'));
        return;
    }
}

module.exports = { adminProtect };