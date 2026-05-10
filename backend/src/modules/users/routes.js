// users.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { upload } = require('../../config/cloudinary');


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/profile/image', authMiddleware, upload.single('image'), userController.uploadProfileImage);
router.post('/profile/cover', authMiddleware, upload.single('image'), userController.uploadCoverImage);
router.get('/:userId', authMiddleware, userController.getUserProfile);

module.exports = router;