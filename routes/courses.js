const express = require('express');

const filterResults = require('../middleware/filter');
const courses = require('../controllers/courses.controller');
const Course = require('../models/Course');

const router = express.Router();

router.route('/')
    .get(filterResults(Course), courses.getAll)
    .post(courses.create);

router.route('/bootcamp/:bootcampId').get(courses.getByBootcampId);

router.route('/:id')
    .get(courses.getById)
    .put(courses.update)
    .delete(courses.delete);

module.exports = router;