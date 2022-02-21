const crypto = require('crypto');

const handleAsync = require("../middleware/async");
const User = require("../models/User");
const CustomError = require('../utils/customError');
const sendEmail = require('../utils/mailer');

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
    }),

    // Get the current logged in user | GET /api/v1/auth/me Private
    getMe: handleAsync(async (req, res) => {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            body: user
        });
    }),

    // Get&set reset password token | POST /api/v1/auth/forgot-password Public
    forgotPassword: handleAsync(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new CustomError('User not found with this email', 404));
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
        // Create and send email message
        const message = `Hello ${user.name},\n\n` +
            `You are receiving this email because you (or someone else) has requested the reset of password.\n\n` +
            `You can use the following link to reset your password:\n${resetUrl}\n\n` +
            `The above link will expire in 10 minutes and can only be used once!\n` +
            `If you did not perform this action, we strongly recommend to change your password immediately!`;

        try {
            await sendEmail({
                to: req.body.email,
                subject: 'Action required to reset your password',
                text: message
            });
            await user.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                body: 'Email sent successfully'
            });
        } catch (err) {
            return next(new CustomError(`Email can not be sent. ERROR: ${err}`, 500));
        }
    }),

    // Reset password | PUT /api/v1/auth/reset-password/:reset_token Public
    resetPassword: handleAsync(async (req, res, next) => {
        // Get hashed token
        const resetToken = crypto.createHash('sha256').update(req.params.reset_token).digest('hex');
        // Check if token is valid
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return next(new CustomError('Invalid or expired token', 400));
        }
        // Save the new password and remove fields for reset password
        user.password = req.body.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Send a confirmation email of changed password
        const message = `Hello ${user.name},\n\n` +
            `We wanted to let you know that your account password was reset. Now you can log in with your new password.\n\n` +
            `If you did not perform this action, we strongly recommend to reset your password immediately ` +
            `by entering <${user.email}> into the form at <https://domain.com/forgot-password> !`;
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Successful',
                text: message
            });

            tokenResponse(user, 200, res);
        } catch (err) {
            return next(new CustomError(`Email can not be sent. ERROR: ${err}`, 500));
        }
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