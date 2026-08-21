const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  views: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Correct pre-save hook – no "next" parameter needed if we use an async function
BlogPostSchema.pre('save', function() {
  this.updated_at = Date.now();
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);