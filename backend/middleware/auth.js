const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password_hash');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
