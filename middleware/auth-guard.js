const jwt = require('jsonwebtoken');

const ENV = require('../config/env.config');
const handleAsync = require('./async');
const CustomError = require('../utils/customError');
const User = require('../models/User');

const authGuard = {
    // Check user authentication
    ensureAuthenticated: handleAsync(async (req, res, next) => {
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
            const payload = jwt.verify(token, ENV.JWT_SECRET);
            req.user = await User.findById(payload.id);

            next();
        } catch (err) {
            console.error(err);
            return next(new CustomError('Authentication token not supplied', 401));
        }

    }),
    // Check if a user is authorized to do a specific action (he has the right 'role')
    authorize: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                if (req.user.role === 'admin') { return next() };

                return next(new CustomError('Not authorize with current role', 403));
            }
            next();
        };
    }
};

module.exports = authGuard;