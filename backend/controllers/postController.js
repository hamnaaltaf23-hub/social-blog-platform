const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { content, media, visibility } = req.body;
    const post = new Post({
      author_id: req.userId,
      content,
      media: media || [],
      visibility: visibility || 'public'
    });
    await post.save();
    await post.populate('author_id', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: 'public' })
      .sort({ created_at: -1 })
      .populate('author_id', 'name avatar')
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.likes.includes(req.userId)) {
      post.likes.push(req.userId);
      await post.save();
    }
    res.json({ message: 'Liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.likes = post.likes.filter(id => id.toString() !== req.userId);
    await post.save();
    res.json({ message: 'Unliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    const comment = new Comment({
      post_id: req.params.postId,
      user_id: req.userId,
      content,
      parent_comment_id: parentCommentId || null
    });
    await comment.save();
    await comment.populate('user_id', 'name avatar');
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.postId, parent_comment_id: null })
      .sort({ created_at: -1 })
      .populate('user_id', 'name avatar');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
