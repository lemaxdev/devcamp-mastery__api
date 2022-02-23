const express = require('express');

const auth = require('../controllers/auth.controller');
const ensureAuth = require('../middleware/auth-guard');

const router = express.Router();

router.get('/me', ensureAuth(), auth.getMe);
router.get('/logout', ensureAuth(), auth.logout);

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);

router.put('/reset-password/:reset_token', auth.resetPassword);
router.put('/update-info', ensureAuth(), auth.updateInfo);
router.put('/update-password', ensureAuth(), auth.updatePass);

module.exports = router;