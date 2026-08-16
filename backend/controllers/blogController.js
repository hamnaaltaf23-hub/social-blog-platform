const BlogPost = require('../models/BlogPost');

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;
    const post = new BlogPost({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      coverImage: coverImage || '',
      category: category || 'General',
      tags: tags || [],
      author_id: req.userId,
      status: status || 'draft'
    });
    await post.save();
    await post.populate('author_id', 'name email avatar');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all published blog posts (public)
exports.getAllPosts = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = { status: 'published' };
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query)
      .populate('author_id', 'name email avatar')
      .sort({ created_at: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts for the logged-in author (including drafts)
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ author_id: req.userId })
      .populate('author_id', 'name email avatar')
      .sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single blog post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId)
      .populate('author_id', 'name email avatar');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Increment view count (if published)
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a blog post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;
    const post = await BlogPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Check authorization
    if (post.author_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.coverImage = coverImage || post.coverImage;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.status = status || post.status;
    await post.save();
    await post.populate('author_id', 'name email avatar');
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique categories (for filter)
exports.getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { status: 'published' });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique tags
exports.getTags = async (req, res) => {
  try {
    const tags = await BlogPost.distinct('tags', { status: 'published' });
    // flatten array of arrays
    const flattened = tags.flat();
    // get unique
    const unique = [...new Set(flattened)];
    res.json(unique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};