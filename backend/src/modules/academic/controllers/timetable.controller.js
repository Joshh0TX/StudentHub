const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/timetables?department=xxx&year=xxx
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
          select: { f_name: true, l_name: true },
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
const createTimetable = async (req, res) => {
  const { id: createdBy, role, courseRepOf } = req.user;
  const { name, department, year, classes } = req.body;

  if (role === "student")
    return res.status(403).json({ error: "Students cannot create timetables." });

  if (role === "course_rep") {
    if (!courseRepOf ||
      courseRepOf.department !== department ||
      courseRepOf.level !== Number(year)) {
      return res.status(403).json({
        error: "Course reps can only create within their own department and year.",
      });
    }
  }

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
        createdBy,
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
      include: {
        classes: true,
        creator: {
          select: { f_name: true, l_name: true },
        },
      },
    });
    return res.status(201).json(timetable);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/timetables/:id
const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const { name, classes } = req.body;
  const { id: requesterId, role, courseRepOf } = req.user;

  try {
    const timetable = await prisma.timetable.findUnique({
      where: { id: parseInt(id) },
    });
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });

    const isOwner = String(timetable.createdBy) === String(requesterId);
    const isAdmin = role === "admin";
    const isCourseRep = role === "course_rep" &&
      courseRepOf?.department === timetable.department &&
      courseRepOf?.level === timetable.year;

    if (!isOwner && !isAdmin && !isCourseRep)
      return res.status(403).json({ error: "You are not authorised to edit this timetable" });

    await prisma.timetableClass.deleteMany({
      where: { timetableId: parseInt(id) },
    });

    const updated = await prisma.timetable.update({
      where: { id: parseInt(id) },
      data: {
        name,
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
      include: {
        classes: true,
        creator: {
          select: { f_name: true, l_name: true },
        },
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/timetables/:id
const deleteTimetable = async (req, res) => {
  const { id } = req.params;
  const { id: requesterId, role, courseRepOf } = req.user;

  try {
    const timetable = await prisma.timetable.findUnique({
      where: { id: parseInt(id) },
    });
    if (!timetable)
      return res.status(404).json({ error: "Timetable not found" });

    const isOwner = String(timetable.createdBy) === String(requesterId);
    const isAdmin = role === "admin";
    const isCourseRep = role === "course_rep" &&
      courseRepOf?.department === timetable.department &&
      courseRepOf?.level === timetable.year;

    if (!isOwner && !isAdmin && !isCourseRep)
      return res.status(403).json({ error: "You can only delete your own timetables" });

    await prisma.timetable.delete({ where: { id: parseInt(id) } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getTimetables, createTimetable, updateTimetable, deleteTimetable };