const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email query required' });
    
    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.userId }
    }).select('_id name email avatar');
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};