const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/timetables?student_id=xxx
const getTimetables = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id)
    return res.status(400).json({ error: "student_id is required" });

  try {
    const timetables = await prisma.timetable.findMany({
      where: { studentId: parseInt(student_id) },
      include: {
        classes: {
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(timetables);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/timetables
// Body: { name, student_id, classes: [{ subject, location, day, startTime, endTime, colorIdx }] }
const createTimetable = async (req, res) => {
  const { name, student_id, classes } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });
  if (!classes || !Array.isArray(classes) || classes.length === 0)
    return res.status(400).json({ error: "at least one class is required" });

  try {
    const timetable = await prisma.timetable.create({
      data: {
        name,
        studentId: student_id ? parseInt(student_id) : null,
        classes: {
          create: classes.map((cls) => ({
            subject: cls.subject,
            location: cls.location ?? null,
            day: cls.day,
            startTime: cls.startTime,
            endTime: cls.endTime,
            colorIdx: cls.colorIdx ?? 0,
          })),
        },
      },
      include: { classes: true },
    });
    return res.status(201).json(timetable);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/timetables/:id
const deleteTimetable = async (req, res) => {
  const { id } = req.params;

  try {
    const timetable = await prisma.timetable.findUnique({
      where: { id: parseInt(id) },
    });
    if (!timetable)
      return res.status(404).json({ error: "Timetable not found" });

    await prisma.timetable.delete({ where: { id: parseInt(id) } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getTimetables, createTimetable, deleteTimetable };