const prisma = require('../../config/prisma');

exports.sendRequest = async (senderId, receiverId) => {
  if (senderId === receiverId) throw new Error("Cannot send request to yourself");
  const existing = await prisma.friendRequest.findUnique({
    where: { senderId_receiverId: { senderId, receiverId } }
  });
  if (existing) throw new Error("Request already sent");
  return prisma.friendRequest.create({
    data: { senderId, receiverId }
  });
};

exports.updateRequest = async (requestId, status) => {
  return prisma.friendRequest.update({
    where: { id: requestId },
    data: { status }
  });
};

exports.getRequests = async (userId) => {
  return prisma.friendRequest.findMany({
    where: { receiverId: userId, status: 'pending' },
    include: {
      sender: {
        select: { id: true, f_name: true, l_name: true, profileImage: true }
      }
    }
  });
};