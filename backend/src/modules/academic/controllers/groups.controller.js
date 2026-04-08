const prisma = require('../../../config/prisma');

exports.createGroup = async (req, res) => {
  try {
    const { name, department, level, description } = req.body;
    const group = await prisma.studyGroup.create({
      data: {
        name,
        department,
        level: parseInt(level),
        description,
        createdBy: 'test-user-123'
      }
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { department, level } = req.query;
    const groups = await prisma.studyGroup.findMany({
      where: {
        ...(department && { department }),
        ...(level && { level: parseInt(level) })
      },
      include: { members: true }
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await prisma.studyGroup.findUnique({
      where: { id: req.params.id },
      include: { members: true, resources: true }
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const member = await prisma.groupMember.create({
      data: {
        groupId: req.params.id,
        userId: 'test-user-123'
      }
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};