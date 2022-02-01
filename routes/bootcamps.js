const Express = require('express');
const Router = Express.Router();

const Bootcamps = require('../controllers/bootcamps.controller');

Router.route('/')
    .get(Bootcamps.getAll)
    .post(Bootcamps.create);

Router.route('/:id')
    .get(Bootcamps.getById)
    .put(Bootcamps.update)
    .delete(Bootcamps.delete);

module.exports = Router