const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: [{ type: String }],
  visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
