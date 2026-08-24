const BlogPost = require('../models/BlogPost');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;
    let coverImageUrl = '';

    // If coverImage is a base64 string, save it as a file
    if (coverImage && coverImage.startsWith('data:image')) {
      const matches = coverImage.match(/^data:image\/(\w+);base64,/);
      const ext = matches ? matches[1] : 'jpg';
      const base64Data = coverImage.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      coverImageUrl = `http://localhost:5000/uploads/${filename}`;
    }

    const post = new BlogPost({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      coverImage: coverImageUrl,
      category: category || 'General',
      tags: tags || [],
      author_id: req.userId,
      status: status || 'draft'
    });
    await post.save();
    await post.populate('author_id', 'name email avatar');
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: err.message });
  }
};

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

exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId)
      .populate('author_id', 'name email avatar');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;
    const post = await BlogPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
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

exports.getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { status: 'published' });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await BlogPost.distinct('tags', { status: 'published' });
    const flattened = tags.flat();
    const unique = [...new Set(flattened)];
    res.json(unique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};