const express = require('express');

const User = require('../models/User');
const admin = require('../controllers/admin.controller');
const filterResults = require('../middleware/filter');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

router.route('/users')
    .get(ensureAuth('admin'), filterResults(User), admin.getAllUsers)
    .post(ensureAuth('admin'), admin.createUser);

router.route('/users/:userId')
    .get(ensureAuth('admin'), admin.getUserById)
    .put(ensureAuth('admin'), admin.updateUserData)
    .delete(ensureAuth('admin'), admin.deleteUser);

module.exports = router;