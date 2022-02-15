const express = require('express');

const filterResults = require('../middleware/filter');
const authGuard = require('../middleware/auth-guard');
const bootcamps = require('../controllers/bootcamps.controller');
const Bootcamp = require('../models/Bootcamp');

const router = express.Router();

router.route('/radius/:zipcode/:distance')
    .get(bootcamps.getByDistance);

router.route('/')
    .get(filterResults(Bootcamp, {
        path: 'courses',
        select: 'title description -bootcamp'
    }), bootcamps.getAll)
    .post(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), bootcamps.create);

router.route('/:id/photo')
    .put(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), bootcamps.uploadPhoto);

router.route('/:id')
    .get(bootcamps.getById)
    .put(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), bootcamps.update)
    .delete(authGuard.ensureAuthenticated, authGuard.authorize('publisher'), bootcamps.delete);

module.exports = router;