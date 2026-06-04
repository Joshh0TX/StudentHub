const prisma = require("../../config/prisma");

const commentInclude = {
  user: { select: { id: true, f_name: true, l_name: true, profileImage: true } },
  likes: { select: { userId: true } },
  _count: { select: { replies: true, likes: true } },
  replies: {
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, f_name: true, l_name: true, profileImage: true } },
      likes: { select: { userId: true } },
      _count: { select: { replies: true, likes: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, f_name: true, l_name: true, profileImage: true } },
          likes: { select: { userId: true } },
          _count: { select: { replies: true, likes: true } },
          replies: [] // stops at 3 levels deep
        }
      }
    }
  }
};

// Get top-level comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null }, // only top-level
      include: commentInclude,
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment or reply
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body; // parentId optional
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: { content, postId, userId, parentId: parentId || null },
      include: commentInclude
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like or unlike a comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } }
    });

    if (existing) {
      await prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId } }
      });
      res.json({ liked: false });
    } else {
      await prisma.commentLike.create({ data: { commentId, userId } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};