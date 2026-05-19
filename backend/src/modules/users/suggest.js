const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSuggested = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user's info
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { department: true, course: true }
    });

    // Get IDs of people already sent requests to
    const sentRequests = await prisma.friendRequest.findMany({
      where: { senderId: userId },
      select: { receiverId: true }
    });
    const excludeIds = [userId, ...sentRequests.map((r) => r.receiverId)];

    // 1. Same department or course (priority)
    const sameDept = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        OR: [
          { department: currentUser.department },
          { course: currentUser.course },
        ]
      },
      select: { id: true, f_name: true, l_name: true, profileImage: true, department: true, course: true },
      take: 3,
    });

    // 2. Friends of friends
    const myFriends = await prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'accepted' },
      select: { receiverId: true }
    });
    const friendIds = myFriends.map((f) => f.receiverId);

    const mutuals = await prisma.friendRequest.findMany({
      where: {
        senderId: { in: friendIds },
        receiverId: { notIn: excludeIds },
        status: 'accepted',
      },
      select: { receiverId: true },
      take: 3,
    });
    const mutualIds = [...new Set(mutuals.map((m) => m.receiverId))];

    const mutualUsers = await prisma.user.findMany({
      where: { id: { in: mutualIds } },
      select: { id: true, f_name: true, l_name: true, profileImage: true, department: true, course: true },
    });

    // 3. Fill remaining with random users
    const alreadyIncluded = [...excludeIds, ...sameDept.map((u) => u.id), ...mutualIds];
    const random = await prisma.user.findMany({
      where: { id: { notIn: alreadyIncluded } },
      select: { id: true, f_name: true, l_name: true, profileImage: true, department: true, course: true },
      take: 3,
    });

    // Combine and deduplicate
    const all = [...sameDept, ...mutualUsers, ...random];
    const seen = new Set();
    const suggested = all.filter((u) => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    }).slice(0, 6);

    res.json(suggested);
  } catch (err) {
    console.error('Error fetching suggested users:', err);
    res.status(500).json({ error: err.message });
  }
};