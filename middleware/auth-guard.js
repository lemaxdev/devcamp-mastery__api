const jwt = require('jsonwebtoken');

const ENV = require('../config/env.config');
const handleAsync = require('./async');
const CustomError = require('../utils/customError');
const User = require('../models/User');

const ensureAuth = (...roles) => handleAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check if token exist
    if (!token) {
        return next(new CustomError('Authentication token not supplied', 401));
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = await User.findById(decoded.id);
    } catch (err) {
        return next(new CustomError('Invalid or expired authentication token', 401));
    }

    // Check if we have roles authorization and the user is NOT an admin
    if (roles.length > 0 && req.user.role !== 'admin') {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError('Not authorize with current role', 403));
        }
    }

    next();
});

module.exports = ensureAuth;