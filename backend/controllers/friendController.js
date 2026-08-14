const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

exports.sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.userId;
    
    const existing = await FriendRequest.findOne({
      $or: [
        { from_user_id: fromUserId, to_user_id: toUserId },
        { from_user_id: toUserId, to_user_id: fromUserId }
      ],
      status: { $ne: 'declined' }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Request already exists' });
    }
    
    const request = new FriendRequest({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending'
    });
    await request.save();
    res.status(201).json({ message: 'Friend request sent', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.to_user_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    request.status = 'accepted';
    await request.save();
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.declineRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.to_user_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    request.status = 'declined';
    await request.save();
    res.json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to_user_id: req.userId,
      status: 'pending'
    }).populate('from_user_id', 'name email avatar');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};