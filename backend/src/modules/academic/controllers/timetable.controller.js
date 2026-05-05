const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/timetables?student_id=xxx
const getTimetables = async (req, res) => {
  const { department, year } = req.query;
  if (!department || !year)
    return res.status(400).json({ error: "department and year are required" });

  try {
    const timetables = await prisma.timetable.findMany({
      where: {
        department,
        year: parseInt(year),
      },
      include: {
        classes: {
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
        creator: {
          select: { f_name: true, l_name: true }, // show who created it
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
  const { name, department, year, created_by, classes } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });
  if (!department || !year)
    return res.status(400).json({ error: "department and year are required" });
  if (!classes || !Array.isArray(classes) || classes.length === 0)
    return res.status(400).json({ error: "at least one class is required" });

  try {
    const timetable = await prisma.timetable.create({
      data: {
        name,
        department,
        year: parseInt(year),
        createdBy: created_by ?? null,
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
  const { student_id } = req.body;

  try {
    const timetable = await prisma.timetable.findUnique({
      where: { id: parseInt(id) },
    });
    if (!timetable)
      return res.status(404).json({ error: "Timetable not found" });
    if (String(timetable.createdBy) !== String(student_id))
      return res.status(403).json({ error: "You can only delete your own timetables" });

    await prisma.timetable.delete({ where: { id: parseInt(id) } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getTimetables, createTimetable, deleteTimetable };