const express = require('express');

const filterResults = require('../middleware/filter');
const authGuard = require('../middleware/auth-guard');
const courses = require('../controllers/courses.controller');
const Course = require('../models/Course');

const router = express.Router();

router.route('/')
    .get(filterResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), courses.getAll)
    .post(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), courses.create);

router.route('/:id')
    .get(courses.getById)
    .put(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), courses.update)
    .delete(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), courses.delete);

module.exports = router;