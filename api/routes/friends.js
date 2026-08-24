const router = require('express').Router();
const { 
  sendRequest, 
  acceptRequest, 
  declineRequest, 
  getPendingRequests,
  getFriends 
} = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendRequest);
router.post('/accept/:requestId', auth, acceptRequest);
router.post('/decline/:requestId', auth, declineRequest);
router.get('/pending', auth, getPendingRequests);
router.get('/list', auth, getFriends); // <-- New route

module.exports = router;