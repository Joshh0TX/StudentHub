const prisma = require("../../config/prisma");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        sender: {
          select: { id: true, f_name: true, l_name: true, profileImage: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dismissNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return res.status(404).json({ error: 'Not found' });
    if (notif.recipientId !== userId) return res.status(403).json({ error: 'Unauthorized' });
    await prisma.notification.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await prisma.notification.count({
      where: { recipientId: userId, isRead: false }
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};