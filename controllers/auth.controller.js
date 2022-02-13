const handleAsync = require("../middleware/async");
const User = require("../models/User");
const CustomError = require('../utils/customError');

const ENV = require('../config/env.config');

const auth = {
    // Register a user | POST /api/v1/auth/register Public
    register: handleAsync(async (req, res) => {
        const { name, email, password, role } = req.body;
        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        tokenResponse(user, 200, res);
    }),

    // Login user | POST /api/v1/auth/login Public
    login: handleAsync(async (req, res, next) => {
        const { email, password } = req.body;

        // Validate if the user provided an email & password
        if (!email || !password) {
            return next(new CustomError('Email and password are required'));
        }
        // Check if exist a user with provided email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new CustomError('Invalid email address', 401));
        }
        // Check the password provided by user
        const validPassword = await user.checkPassword(password);
        if (!validPassword) {
            return next(new CustomError('Invalid password', 401));
        }

        tokenResponse(user, 200, res);
    })
};

// Sign(create) and get new token, create cookie and send response
function tokenResponse(user, statusCode, res) {
    // Create the token
    const token = user.getSignedToken();

    // Cookie options
    const options = {
        expires: new Date(Date.now() + ENV.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    // Set the cookie and send response
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

module.exports = auth;