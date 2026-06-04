const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const commentController = require('./comment.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.delete('/:postId', authMiddleware, postController.deletePost);
router.get('/trending', postController.getTrending);
router.get('/hashtag/:tag', postController.getPostsByHashtag);
router.post('/:postId/like', authMiddleware, postController.toggleLike);

// Comments
router.get('/:postId/comments', authMiddleware, commentController.getComments);
router.post('/:postId/comments', authMiddleware, commentController.addComment);
router.delete('/comments/:commentId', authMiddleware, commentController.deleteComment);
router.post('/comments/:commentId/like', authMiddleware, commentController.likeComment);

module.exports = router;