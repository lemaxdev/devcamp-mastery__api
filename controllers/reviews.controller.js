const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const CustomError = require('../utils/customError');
const handleAsync = require('../middleware/async');

const reviews = {
    // Get all reviews | GET /api/v1/reviews | PUBLIC
    getAll: handleAsync(async (req, res) => {
        res.status(200).json(res.filterResults);
    }),

    // Get one review by id | GET /api/v1/reviews/:id | PUBLIC
    getById: handleAsync(async (req, res, next) => {
        const review = await Review.findById(req.params.id).populate([{
            path: 'bootcamp',
            select: 'name description'
        }, {
            path: 'user',
            select: 'name email role'
        }]);
        if (!review) {
            return next(new CustomError(`REVIEW not found`, 404));
        };

        res.status(200).json({ success: true, body: review });
    }),

    // Create a new review | POST /api/v1/reviews | PRIVAT
    create: handleAsync(async (req, res, next) => {
        // Check if the bootcamp for which the review is being added exist
        const bootcamp = await Bootcamp.findById(req.body.bootcamp);
        if (!bootcamp) {
            return next(new CustomError(`BOOTCAMP not found, cannot add a review for a Bootcamp does not exist`, 404));
        }

        // Verify the limit of one review per bootcamp
        const isLimitReached = await Review.findOne({ user: req.user.id, bootcamp: req.body.bootcamp });
        if (isLimitReached && req.user.role !== 'admin') {
            return next(new CustomError(`The user has already written a review for this bootcamp`, 403));
        }

        // Add user id to the req.body in order to be saved to the database 
        req.body.user = req.user.id;
        const review = await Review.create(req.body);

        res.status(200).json({ success: true, body: review });
    }),

    // Update one review by id | PUT /api/v1/reviews/:id | PRIVAT
    update: handleAsync(async (req, res, next) => {
        // Check if the review exist
        let review = await Review.findById(req.params.id);
        if (!review) {
            return next(new CustomError(`REVIEW not found`, 404));
        };
        // User must own the review or has to be an admin in order to UPDATE the review
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError(`The user doesn't have access to update this review`, 403));
        };

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });

        res.status(200).json({ success: true, body: review });
    }),

    // Delete one review by id | PUT /api/v1/reviews/:id | PRIVAT
    delete: handleAsync(async (req, res, next) => {
        // Check if the review exist
        const review = await Review.findById(req.params.id);
        if (!review) {
            return next(new CustomError(`REVIEW not found`, 404));
        };
        // User must own the review or has to be an admin in order to DELETE the review
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError(`The user doesn't have access to delete this review`, 403));
        };

        review.remove();
        res.status(200).json({ success: true, body: review });
    }),
};

module.exports = reviews;