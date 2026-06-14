const prisma = require("../../config/prisma");
const { createNotification } = require('../notifications/notification.service');

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
          replies: []
        }
      }
    }
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: commentInclude,
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: { content, postId, userId, parentId: parentId || null },
      include: commentInclude
    });

    if (parentId) {
      // Reply — notify parent comment owner
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { userId: true }
      });
      await createNotification({
        recipientId: parentComment.userId,
        senderId: userId,
        type: 'reply',
        message: 'replied to your comment',
        postId,
        commentId: parentId,
      });
    } else {
      // Top-level comment — notify post owner
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true }
      });
      await createNotification({
        recipientId: post.userId,
        senderId: userId,
        type: 'comment',
        message: 'commented on your post',
        postId,
        commentId: comment.id,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
      return res.json({ liked: false });
    } else {
      await prisma.commentLike.create({ data: { commentId, userId } });

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true, postId: true }
      });

      await createNotification({
        recipientId: comment.userId,
        senderId: userId,
        type: 'comment_like',
        message: 'liked your comment',
        postId: comment.postId,
        commentId,
      });

      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};