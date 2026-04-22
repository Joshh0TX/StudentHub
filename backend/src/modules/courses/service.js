// courses.service.js
const prisma = require("../../config/prisma");
const generateCode = require("../../utils/generateCode");

exports.createCourse = async (userId, data) => {
    const classCode = generateCode();

    const course = await prisma.course.create({
        data: {
            name: data.name,
            courseCode: data.courseCode,
            classCode,
            createdBy: userId,
        },
    });

    // Make creator a rep
    await prisma.courseMember.create({
        data: {
            userId,
            courseId: course.id,
            role: "rep",
        },
    });

    return { course, classCode };
};