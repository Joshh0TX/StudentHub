exports.joinCourse = async (userId, classCode) => {
    const course = await prisma.course.findUnique({
        where: { classCode },
    });

    if (!course) throw new Error("Invalid class code");

    return prisma.courseMember.create({
        data: {
            userId,
            courseId: course.id,
            role: "student",
        },
    });
};