const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  getCategories,
  getTags
} = require('../controllers/blogController');

// Public routes (no auth required)
router.get('/posts', getAllPosts);
router.get('/posts/:postId', getPostById);
router.get('/categories', getCategories);
router.get('/tags', getTags);

// Protected routes (auth required)
router.post('/posts', auth, createPost);
router.get('/my-posts', auth, getMyPosts);
router.put('/posts/:postId', auth, updatePost);
router.delete('/posts/:postId', auth, deletePost);

module.exports = router;