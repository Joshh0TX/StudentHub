const friendService = require('./friend.service');

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const request = await friendService.sendRequest(senderId, receiverId);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await friendService.updateRequest(requestId, 'accepted');
    res.json(request);
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