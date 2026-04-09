// assignments.service.js
const prisma = require("../../prisma/client");

exports.createAssignment = async (userId, data) => {
    // Check if user is rep
    const member = await prisma.courseMember.findFirst({
        where: {
            userId,
            courseId: data.courseId,
        },
    });

    if (!member || member.role !== "rep") {
        throw new Error("Only reps can create assignments");
    }

    return prisma.assignment.create({
        data: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            courseId: data.courseId,
            createdBy: userId,
        },
    });
};