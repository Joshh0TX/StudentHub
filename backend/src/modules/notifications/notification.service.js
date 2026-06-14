const prisma = require("../../config/prisma");

exports.createNotification = async ({ recipientId, senderId, type, message, postId, commentId }) => {
  // Don't notify yourself
  if (recipientId === senderId) return;

  await prisma.notification.create({
    data: {
      recipientId,
      senderId,
      type,
      message,
      postId: postId || null,
      commentId: commentId || null,
    }
  });
};