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

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// For Vercel, we cannot use static files from uploads easily,
// but we keep the route for local dev. In production, consider using cloud storage.
// We'll comment out the static serving for now, but keep the route if needed.
// app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running on Vercel!' });
});

// Export the app for Vercel serverless function
module.exports = app;