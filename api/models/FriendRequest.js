const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
  from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
