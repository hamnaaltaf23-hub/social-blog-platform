const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Send a friend request
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

// Accept a friend request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const tokenUserId = req.userId.toString();
    const toUserId = request.to_user_id.toString();

    if (tokenUserId !== toUserId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    request.status = 'accepted';
    await request.save();
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Decline a friend request
exports.declineRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const tokenUserId = req.userId.toString();
    const toUserId = request.to_user_id.toString();

    if (tokenUserId !== toUserId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    request.status = 'declined';
    await request.save();
    res.json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get pending friend requests for current user
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

// NEW: Get all accepted friends of the current user
exports.getFriends = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const friendRequests = await FriendRequest.find({
      $or: [
        { from_user_id: currentUserId, status: 'accepted' },
        { to_user_id: currentUserId, status: 'accepted' }
      ]
    }).populate('from_user_id', 'name email avatar')
      .populate('to_user_id', 'name email avatar');

    const friends = friendRequests.map(req => {
      if (req.from_user_id._id.toString() === currentUserId) {
        return req.to_user_id;
      } else {
        return req.from_user_id;
      }
    });

    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};