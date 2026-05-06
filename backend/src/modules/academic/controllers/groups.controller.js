const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      },
    });
    if (!group) return res.status(404).json({ error: "Group not found" });
    return res.json(group);
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
  const createdBy = req.user.id;
  const { name, course_code, course_title, description, max_members, year, department } = req.body;

  const missing = ["name", "department"].filter((f) => !req.body[f]);
  if (missing.length)
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

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
  const requesterId = req.user.id;

  try {
    const group = await prisma.studyGroup.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.createdBy !== requesterId)
      return res.status(403).json({ error: "Not authorised" });

    await prisma.studyGroup.delete({ where: { id } });
    return res.json({ message: "Group deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getGroups, getGroupById, getMyGroups, createGroup, deleteGroup, joinGroup };