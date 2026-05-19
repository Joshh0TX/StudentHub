// users.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { upload } = require('../../config/cloudinary');
const { getSuggested } = require('./suggest');
const friendController = require('./friend.controller');


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/profile/image', authMiddleware, upload.single('image'), userController.uploadProfileImage);
router.post('/profile/cover', authMiddleware, upload.single('image'), userController.uploadCoverImage);
router.get('/suggested', authMiddleware, getSuggested); // ← moved up
router.get('/:userId', authMiddleware, userController.getUserProfile); // ← after
router.post('/friend-request/:receiverId', authMiddleware, friendController.sendFriendRequest);
router.get('/friends/inbound', authMiddleware, friendController.getInboundRequests);
router.get('/friends/sent', authMiddleware, friendController.getSentRequests);
router.get('/friends/connections', authMiddleware, friendController.getConnections);
router.post('/friends/respond/:requestId', authMiddleware, friendController.respondToRequest);


module.exports = router;