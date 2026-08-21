const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  getMyProfile,
  updateProfile,
  uploadAvatar,
  uploadCover
} = require('../controllers/profileController');

// Public route (view anyone's profile)
router.get('/:userId', getProfile);

// Protected routes (require login)
router.get('/me/profile', auth, getMyProfile);
router.put('/me', auth, updateProfile);
router.put('/me/avatar', auth, uploadAvatar);
router.put('/me/cover', auth, uploadCover);

module.exports = router;