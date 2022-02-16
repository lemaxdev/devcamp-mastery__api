// Controller for CRUD operations on courses
const Course = require('../models/Course');
const handleAsync = require('../middleware/async');
const CustomError = require('../utils/customError');
const Bootcamp = require('../models/Bootcamp');

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

    // Add a new course | POST  /api/v1/courses | Privat
    create: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.body.bootcamp);
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found, cannot create a course to a Bootcamp does not exist', 404));
        }

        // Check user ownership of the bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError('The user is not authorized to create a course for this bootcamp', 403));
        }

        req.body.user = req.user.id;
        const course = await Course.create(req.body);

        res.status(200).json({
            success: true,
            body: course
        });
    }),

    // Update a course | PUT  /api/v1/courses/:id | Privat
    update: handleAsync(async (req, res, next) => {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return next(new CustomError('COURSE not found', 404));
        }

        // Check user ownership of the course
        if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError('The user is not authorized to update this course', 403));
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            body: course
        });
    }),

    // Delete a course | DELETE  /api/v1/courses/:id | Privat
    delete: handleAsync(async (req, res, next) => {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return next(new CustomError('COURSE not found', 404));
        }

        // Check user ownership of the course
        if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError('The user is not authorized to delete this course', 403));
        }

        course.remove();
        res.status(200).json({
            success: true,
            body: course
        });
    })
}

module.exports = courses;