const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const extractHashtags = (content) => {
  if (!content) return [];
  const matches = content.match(/#[a-zA-Z0-9_]+/g) || [];
  return matches.map((tag) => tag.slice(1).toLowerCase());
};

exports.createPost = async (userId, { content, image, video }) => {
  const post = await prisma.post.create({
    data: {
      userId,
      content: content || null,
      image,
      video,
    },
    include: {
      user: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      }
    }
  });

  // Extract and save hashtags
  const tags = extractHashtags(content);
  for (const tag of tags) {
    const hashtag = await prisma.hashtag.upsert({
      where: { tag },
      update: {},
      create: { tag },
    });
    await prisma.postHashtag.create({
      data: { postId: post.id, hashtagId: hashtag.id },
    });
  }

  return post;
};

exports.getPosts = async (userId) => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      },
      hashtags: { include: { hashtag: true } },
      likes: {
        select: { userId: true } // ← fix this
      },
      _count: { select: { likes: true } }
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

exports.getTrending = async (period) => {
  const since = new Date();
  if (period === '24h') {
    since.setHours(since.getHours() - 24);
  } else {
    since.setDate(since.getDate() - 7);
  }

  const trending = await prisma.postHashtag.groupBy({
    by: ['hashtagId'],
    where: { createdAt: { gte: since } },
    _count: { hashtagId: true },
    orderBy: { _count: { hashtagId: 'desc' } },
    take: 10,
  });

  const results = await Promise.all(
    trending.map(async (item) => {
      const hashtag = await prisma.hashtag.findUnique({
        where: { id: item.hashtagId }
      });
      return { tag: hashtag.tag, count: item._count.hashtagId };
    })
  );

  return results;
};

exports.getPostsByHashtag = async (tag) => {
  return prisma.post.findMany({
    where: {
      hashtags: {
        some: { hashtag: { tag: tag.toLowerCase() } }
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      }
    }
  });
};