// users.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;