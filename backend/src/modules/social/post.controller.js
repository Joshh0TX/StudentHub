const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postService = require('./post.service');

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image, video } = req.body;
    const post = await postService.createPost(userId, { content, image, video });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await postService.getPosts(req.user.id);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await postService.deletePost(postId, userId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(403).json({ message: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { period } = req.query; // '24h' or '7d'
    const trending = await postService.getTrending(period || '7d');
    res.json(trending);
  } catch (error) {
    console.error('Error fetching trending:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPostsByHashtag = async (req, res) => {
  try {
    const { tag } = req.params;
    const posts = await postService.getPostsByHashtag(tag);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by hashtag:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } }
    });

    if (existing) {
      await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { postId, userId } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};