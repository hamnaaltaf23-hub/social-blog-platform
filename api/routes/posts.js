const router = require('express').Router();
const { createPost, getFeed, likePost, unlikePost, addComment, getComments } = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, createPost);
router.get('/feed', auth, getFeed);
router.post('/:postId/like', auth, likePost);
router.delete('/:postId/like', auth, unlikePost);
router.post('/:postId/comments', auth, addComment);
router.get('/:postId/comments', auth, getComments);

module.exports = router;
