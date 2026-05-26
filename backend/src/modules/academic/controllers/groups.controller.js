const prisma = require("../../../config/prisma");

// GET /api/groups?department=CSC&year=1
const getGroups = async (req, res) => {
  const { department, year } = req.query;
  if (!department)
    return res.status(400).json({ error: "department is required" });

  try {
    const groups = await prisma.studyGroup.findMany({
      where: {
        department,
        ...(year ? { year: parseInt(year) } : {}),
      },
      include: {
        _count: { select: { members: true } },
        creator: {
          select: { f_name: true, l_name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = groups.map((g) => ({
      ...g,
      member_count: g._count.members,
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/groups/:id
const getGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await prisma.studyGroup.findUnique({
      where: { id },
      include: {
        resources: true,
        creator: {
          select: { f_name: true, l_name: true },
        },
        _count: { select: { members: true } },
      },
    });
    if (!group) return res.status(404).json({ error: "Group not found" });

    return res.json({
      ...group,
      member_count: group._count.members,
      schedules: [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/groups/my-groups
const getMyGroups = async (req, res) => {
  const userId = req.user.id;

  try {
    const memberships = await prisma.studyGroupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: { select: { members: true } },
            creator: {
              select: { f_name: true, l_name: true },
            },
          },
        },
      },
    });

    const groups = memberships.map((m) => ({
      ...m.group,
      member_count: m.group._count.members,
    }));

    return res.json(groups);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/groups
const createGroup = async (req, res) => {
  const { id: createdBy } = req.user;
  const {
    name,
    course_code,
    course_title,
    description,
    max_members,
    year,
    department,
  } = req.body;

  const missing = ["name", "department"].filter((f) => !req.body[f]);
  if (missing.length)
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missing.join(", ")}` });

  try {
    const group = await prisma.studyGroup.create({
      data: {
        name,
        course_code: course_code ?? null,
        course_title: course_title ?? null,
        description: description ?? null,
        max_members: max_members ? parseInt(max_members) : null,
        department,
        year: year ? parseInt(year) : null,
        createdBy,
      },
      include: {
        creator: {
          select: { f_name: true, l_name: true },
        },
      },
    });
    return res.status(201).json(group);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/groups/:id/join
const joinGroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const group = await prisma.studyGroup.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: "Group not found" });

    const existing = await prisma.studyGroupMember.findUnique({
      where: { groupId_userId: { groupId: id, userId } },
    });
    if (existing) return res.status(400).json({ error: "Already a member" });

    await prisma.studyGroupMember.create({
      data: { groupId: id, userId },
    });
    return res.json({ message: "Joined successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/groups/:id
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const { id: requesterId, role, courseRepOf } = req.user;

  try {
    const group = await prisma.studyGroup.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: "Group not found" });

    const isOwner = group.createdBy === requesterId;
    const isAdmin = role === "admin";
    const isCourseRep =
      role === "course_rep" &&
      courseRepOf?.department === group.department &&
      courseRepOf?.level === group.year;

    if (!isOwner && !isAdmin && !isCourseRep)
      return res.status(403).json({ error: "Not authorised" });

    await prisma.studyGroupMember.deleteMany({ where: { groupId: id } });
    await prisma.studyGroup.delete({ where: { id } });
    return res.json({ message: "Group deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createSchedule = async (req, res) => {
  const { id } = req.params;
  const { title, date_time, is_online, location, meeting_url, notes } =
    req.body;
  const userId = req.user.id; // ← populated by authMiddleware

  // Validation
  if (!title?.trim())
    return res.status(400).json({ error: "Session title is required." });
  if (!date_time)
    return res.status(400).json({ error: "Date and time are required." });
  if (is_online && !meeting_url?.trim())
    return res
      .status(400)
      .json({ error: "Meeting URL is required for online sessions." });
  if (!is_online && !location?.trim())
    return res
      .status(400)
      .json({ error: "Location is required for in-person sessions." });

  try {
    const group = await prisma.studyGroup.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: "Group not found." });

    const schedule = await prisma.studyGroupSchedule.create({
      // ← correct model name
      data: {
        groupId: id,
        createdBy: userId, // ← required field from schema
        title: title.trim(),
        date_time: new Date(date_time), // ← schema uses snake_case, no conversion needed
        isOnline: is_online,
        location: location?.trim() || null,
        meeting_url: meeting_url?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    // Schema already uses snake_case so response maps directly
    return res.status(201).json({
      id: schedule.id,
      title: schedule.title,
      date_time: schedule.date_time,
      is_online: schedule.is_online,
      location: schedule.location,
      meeting_url: schedule.meeting_url,
      notes: schedule.notes,
    });
  } catch (err) {
    console.error("createSchedule error:", err);
    return res.status(500).json({ error: "Failed to create schedule." });
  }
};

module.exports = {
  getGroups,
  getGroupById,
  getMyGroups,
  createGroup,
  deleteGroup,
  joinGroup,
  createSchedule,
};
