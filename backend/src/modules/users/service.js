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
  const { bio, course, location, email, skills, interests, badges, achievements, projects, socials } = data;
  return prisma.user.update({
    where: { id: userId },
    data: { bio, course, location, email, skills, interests, badges, achievements, projects, socials },
  });
};