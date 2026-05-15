const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const controller = require('./comment.controller');

router.get('/:postId/comments', controller.getComments);
router.post('/:postId/comments', authMiddleware, controller.addComment);
router.delete('/comments/:commentId', authMiddleware, controller.deleteComment);

module.exports = router;