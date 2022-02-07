const Express = require('express');
const Router = Express.Router();

const filterResults = require('../middleware/filter');
const Bootcamp = require('../models/Bootcamp');
const bootcamps = require('../controllers/bootcamps.controller');

Router.route('/radius/:zipcode/:distance')
    .get(bootcamps.getByDistance);

Router.route('/')
    .get(filterResults(Bootcamp), bootcamps.getAll)
    .post(bootcamps.create);

Router.route('/:id')
    .get(bootcamps.getById)
    .put(bootcamps.update)
    .delete(bootcamps.delete);

module.exports = Router