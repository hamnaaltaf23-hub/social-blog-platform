const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllComments,
  moderateComment,
  deleteComment
} = require('../controllers/adminController');

// All routes require authentication AND admin role
router.use(auth, admin);

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Post management
router.get('/posts', getAllPosts);
router.delete('/posts/:postId', deletePost);

// Comment management
router.get('/comments', getAllComments);
router.put('/comments/:commentId/moderate', moderateComment);
router.delete('/comments/:commentId', deleteComment);

module.exports = router;