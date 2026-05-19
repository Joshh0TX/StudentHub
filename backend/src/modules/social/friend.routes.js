const express = require('express');
const router = express.Router();
const friendController = require('./friend.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/request/:receiverId', authMiddleware, friendController.sendRequest);
router.put('/request/:requestId/accept', authMiddleware, friendController.acceptRequest);
router.put('/request/:requestId/reject', authMiddleware, friendController.rejectRequest);
router.get('/requests', authMiddleware, friendController.getRequests);

module.exports = router;