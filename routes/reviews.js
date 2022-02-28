const express = require('express');

const Review = require('../models/Review');
const reviews = require('../controllers/reviews.controller');
const filterResults = require('../middleware/filter');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

router.route('/')
    .get(filterResults(Review, [{
        path: 'bootcamp',
        select: 'name description'
    }, {
        path: 'user',
        select: 'name email role'
    }]), reviews.getAll)
    .post(ensureAuth('user'), reviews.create);

router.route('/:id')
    .get(reviews.getById)
    .put(ensureAuth('user'), reviews.update)
    .delete(ensureAuth('user'), reviews.delete);

module.exports = router;