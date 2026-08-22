const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({ status: 'flagged' });

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      pendingComments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (for admin management)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash').sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user role (make admin or remove admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password_hash');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts (for admin moderation)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author_id', 'name email')
      .sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments (for moderation)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user_id', 'name email')
      .populate('post_id', 'content')
      .sort({ created_at: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve or flag a comment
exports.moderateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'flagged'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status },
      { new: true }
    );
    
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment moderated', comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};