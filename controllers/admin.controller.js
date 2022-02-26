const handleAsync = require("../middleware/async");
const User = require("../models/User");
const CustomError = require("../utils/customError");

const admin = {
    // Fetch all users from database | GET /api/v1/admin/users | ADMIN ONLY
    getAllUsers: handleAsync(async (req, res) => {
        res.status(200).json(res.filterResults);
    }),

    // Get a user by his ID | GET /api/v1/admin/users/:userId | ADMIN ONLY
    getUserById: handleAsync(async (req, res, next) => {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new CustomError('USER not found', 404));
        }

        res.status(200).json({ succes: true, body: user });
    }),

    // Create a new user | POST /api/v1/admin/users | ADMIN ONLY
    createUser: handleAsync(async (req, res, next) => {
        const user = await User.create(req.body);

        res.status(200).json({ succes: true, body: user });
    }),

    // Update a user's details | PUT /api/v1/admin/users/:userId | ADMIN ONLY
    updateUserData: handleAsync(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
            runValidators: true,
            new: true
        });
        if (!user) {
            return next(new CustomError('USER not found', 404));
        }

        res.status(200).json({ succes: true, body: user });
    }),

    // Delete a user | DELETE /api/v1/admin/users/:userId | ADMIN ONLY
    deleteUser: handleAsync(async (req, res, next) => {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return next(new CustomError('USER not found', 404));
        }

        res.status(200).json({ succes: true, body: user });
    }),
};

module.exports = admin;