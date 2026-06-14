const express = require('express');
const router = express.Router();
const notifController = require('./notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.get('/', authMiddleware, notifController.getNotifications);
router.get('/unread-count', authMiddleware, notifController.getUnreadCount);
router.post('/:id/read', authMiddleware, notifController.markOneRead);
router.post('/read-all', authMiddleware, notifController.markAllRead);
router.delete('/:id', authMiddleware, notifController.dismissNotification);

module.exports = router;