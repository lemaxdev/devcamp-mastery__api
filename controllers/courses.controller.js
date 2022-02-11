// Controller for CRUD operations on courses
const Course = require('../models/Course');
const handleAsync = require('../middleware/async');
const CustomError = require('../utils/customError');

const courses = {
    // Fetch all courses | GET /api/v1/courses | Public
    getAll: handleAsync(async (req, res) => {
        res.status(200).json(res.filterResults);
    }),

    // Get course by ID | GET /api/v1/courses/:id | Public
    getById: handleAsync(async (req, res, next) => {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return next(new CustomError('COURSE not found', 404));
        }

        res.status(200).json({
            success: true,
            body: course
        });
    }),

    // Get courses for a bootcamp | GET /api/v1/courses/bootcamp/:bootcampId | Public
    getByBootcampId: handleAsync(async (req, res, next) => {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        if (courses.length == 0) {
            return next(new CustomError('COURSE not found', 404));
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            body: courses
        });
    }),

    // Add a new course | POST  /api/v1/courses | Privat
    create: handleAsync(async (req, res) => {
        const course = await Course.create(req.body);

        res.status(200).json({
            success: true,
            body: course
        })
    }),

    // Update a course | PUT  /api/v1/courses/:id | Privat
    update: handleAsync(async (req, res, next) => {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return next(new CustomError('COURSE not found', 404));
        }

        res.status(200).json({
            success: true,
            body: course
        });
    }),

    // Delete a course | DELETE  /api/v1/courses/:id | Privat
    delete: handleAsync(async (req, res, next) => {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return next(new CustomError('COURSE not found', 404));
        }

        res.status(200).json({
            success: true,
            body: course
        });
    })
}

module.exports = courses;