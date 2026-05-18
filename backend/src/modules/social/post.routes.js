const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.delete('/:postId', authMiddleware, postController.deletePost);
router.get('/trending', postController.getTrending);     
router.get('/hashtag/:tag', postController.getPostsByHashtag);

module.exports = router;