// users.service.js
const prisma = require("../../prisma/client");

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