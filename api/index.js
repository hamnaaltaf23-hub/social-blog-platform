const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const friendRoutes = require('./routes/friends');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');
const profileRoutes = require('./routes/profile');

const app = express();

try {
  connectDB();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/friends', friendRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/profile', profileRoutes);

  app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running on Vercel!' });
  });

} catch (err) {
  console.error('Startup error:', err);
}

module.exports = app;