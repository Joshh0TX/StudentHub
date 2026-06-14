// users.service.js
const prisma = require("../../config/prisma");

exports.getProfile = async (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        include: {
            posts: true,
            followers: true,
            following: true,
            courseMemberships: {
                include: {
                    course: true,
                },
            },
        },
    });
};

exports.updateProfile = async (userId, data) => {
  const allowedFields = ['bio', 'course', 'location', 'email', 'skills', 'interests', 'badges', 'achievements', 'projects', 'socials', 'profileImage', 'coverImage', 'dob'];
  
  const updateData = {};
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};


exports.searchUsers = async (query) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { f_name: { contains: query, mode: 'insensitive' } },
        { l_name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { course: { contains: query, mode: 'insensitive' } },
        { department: { contains: query, mode: 'insensitive' } },
      ]
    },
    select: {
      id: true,
      f_name: true,
      l_name: true,
      profileImage: true,
      course: true,
      department: true,
    },
    take: 8,
  });
};