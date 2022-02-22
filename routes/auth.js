const express = require('express');

const auth = require('../controllers/auth.controller');
const authGuard = require('../middleware/auth-guard');

const router = express.Router();

router.get('/me', authGuard.ensureAuthenticated, auth.getMe);

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);

router.put('/reset-password/:reset_token', auth.resetPassword);
router.put('/update-info', authGuard.ensureAuthenticated, auth.updateInfo);
router.put('/update-password', authGuard.ensureAuthenticated, auth.updatePass);

module.exports = router;