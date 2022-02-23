const express = require('express');

const Bootcamp = require('../models/Bootcamp');
const bootcamps = require('../controllers/bootcamps.controller');
const filterResults = require('../middleware/filter');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

router.route('/radius/:zipcode/:distance')
    .get(bootcamps.getByDistance);

router.route('/')
    .get(filterResults(Bootcamp, {
        path: 'courses',
        select: 'title description -bootcamp'
    }), bootcamps.getAll)
    .post(ensureAuth('publisher'), bootcamps.create);

router.route('/:id/photo')
    .put(ensureAuth('publisher'), bootcamps.uploadPhoto);

router.route('/:id')
    .get(bootcamps.getById)
    .put(ensureAuth('publisher'), bootcamps.update)
    .delete(ensureAuth('publisher'), bootcamps.delete);

module.exports = router;