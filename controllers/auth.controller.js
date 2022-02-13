const handleAsync = require("../middleware/async");
const User = require("../models/User");
const CustomError = require('../utils/customError');

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

        // Create token and send it
        const token = user.getSignedToken();
        res.status(200).json({
            success: true,
            token
        });
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

        // Create token and send it
        const token = user.getSignedToken();
        res.status(200).json({
            success: true,
            token
        })
    })
}

module.exports = auth;