const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['approved', 'flagged'], default: 'approved' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
