const express = require('express');

const User = require('../models/User');
const admin = require('../controllers/admin.controller');
const filterResults = require('../middleware/filter');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

// Ensure user is authenticated and authorized as 'admin' for all routes
router.use(ensureAuth('admin'));

router.route('/users')
    .get(filterResults(User), admin.getAllUsers)
    .post(admin.createUser);

router.route('/users/:userId')
    .get(admin.getUserById)
    .put(admin.updateUserData)
    .delete(admin.deleteUser);

module.exports = router;