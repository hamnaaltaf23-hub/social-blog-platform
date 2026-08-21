const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password_hash');
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    req.userId = user._id;
    // ✅ Always call next() to proceed to the next middleware/route handler
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    // Do NOT call next(err) – just return a JSON error response
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
