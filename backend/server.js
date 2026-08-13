const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
// Post routes
app.use('/api/posts', postRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
