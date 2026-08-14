const router = require('express').Router();
const { sendRequest, acceptRequest, declineRequest, getPendingRequests } = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendRequest);
router.post('/accept/:requestId', auth, acceptRequest);
router.post('/decline/:requestId', auth, declineRequest);
router.get('/pending', auth, getPendingRequests);

module.exports = router;
