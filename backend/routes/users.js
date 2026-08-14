const router = require('express').Router();
const { searchUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/search', auth, searchUsers);

module.exports = router;
