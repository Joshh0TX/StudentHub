exports.getUserCourses = async (userId) => {
    return prisma.courseMember.findMany({
        where: { userId },
        include: {
            course: true,
        },
    });
};