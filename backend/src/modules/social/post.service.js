const prisma = require('../../config/prisma');

exports.createPost = async (userId, { content, image }) => {
  return prisma.post.create({
    data: { userId, content, image },
    include: {
      user: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      }
    }
  });
};

exports.getPosts = async () => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      }
    }
  });
};

exports.deletePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');
  if (post.userId !== userId) throw new Error('Unauthorized');

  await prisma.post.delete({ where: { id: postId } });
  return post;
};