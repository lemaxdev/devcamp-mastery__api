const express = require('express');

const filterResults = require('../middleware/filter');
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
    .post(bootcamps.create);

router.route('/:id')
    .get(bootcamps.getById)
    .put(bootcamps.update)
    .delete(bootcamps.delete);

module.exports = router;