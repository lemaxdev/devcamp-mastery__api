const express = require('express');

const Course = require('../models/Course');
const courses = require('../controllers/courses.controller');
const filterResults = require('../middleware/filter');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

router.route('/')
    .get(filterResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), courses.getAll)
    .post(ensureAuth('publisher'), courses.create);

router.route('/:id')
    .get(courses.getById)
    .put(ensureAuth('publisher'), courses.update)
    .delete(ensureAuth('publisher'), courses.delete);

module.exports = router;