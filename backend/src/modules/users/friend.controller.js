const prisma = require("../../config/prisma");

exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    // Check both directions
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });
    // In sendFriendRequest, after the existing check:
if (existing) {
  console.log('Existing request found:', existing); // ← ADD
  return res.status(400).json({ message: 'Request already exists', existing });
}

    await prisma.friendRequest.create({
      data: { senderId, receiverId }
    });
    res.json({ message: 'Request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInboundRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: {
        sender: {
          select: { id: true, f_name: true, l_name: true, profileImage: true, course: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'pending' },
      include: {
        receiver: {
          select: { id: true, f_name: true, l_name: true, profileImage: true, course: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const accepted = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      },
      include: {
        sender: { select: { id: true, f_name: true, l_name: true, profileImage: true, course: true } },
        receiver: { select: { id: true, f_name: true, l_name: true, profileImage: true, course: true } }
      }
    });

    const connections = accepted.map((r) =>
      r.senderId === userId ? r.receiver : r.sender
    );
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    if (action === 'rejected') {
      await prisma.friendRequest.delete({ where: { id: requestId } });
    } else {
      // Accept this request
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' }
      });

      // Delete the reverse request if it exists (user A sent to user B, user B sent to user A)
      await prisma.friendRequest.deleteMany({
        where: {
          senderId: request.receiverId,
          receiverId: request.senderId,
          status: 'pending'
        }
      });
    }

    res.json({ message: `Request ${action}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};