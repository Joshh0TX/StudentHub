const friendService = require('./friend.service');
const prisma = require('../../config/prisma');
const { createNotification } = require('../notifications/notification.service');

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const request = await friendService.sendRequest(senderId, receiverId);

    await createNotification({
      recipientId: receiverId,
      senderId,
      type: 'friend_request',
      message: 'sent you a friend request',
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Fetch request before updating so we have senderId
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const updated = await friendService.updateRequest(requestId, 'accepted');

    await createNotification({
      recipientId: request.senderId,
      senderId: userId,
      type: 'friend_accept',
      message: 'accepted your friend request',
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await friendService.updateRequest(requestId, 'rejected');
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await friendService.getRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};