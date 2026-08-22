const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website, privacy_settings } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (privacy_settings) user.privacy_settings = privacy_settings;

    await user.save();
    const updatedUser = await User.findById(req.userId).select('-password_hash');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload avatar image (base64)
exports.uploadAvatar = async (req, res) => {
  try {
    const { avatar } = req.body; // base64 string
    if (!avatar || !avatar.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const matches = avatar.match(/^data:image\/(\w+);base64,/);
    const ext = matches ? matches[1] : 'jpg';
    const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = 'avatar-' + req.userId + '-' + Date.now() + '.' + ext;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    const avatarUrl = `http://localhost:5000/uploads/${filename}`;

    const user = await User.findById(req.userId);
    user.avatar = avatarUrl;
    await user.save();

    res.json({ avatar: avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Upload cover image (base64)
exports.uploadCover = async (req, res) => {
  try {
    const { coverImage } = req.body;
    if (!coverImage || !coverImage.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const matches = coverImage.match(/^data:image\/(\w+);base64,/);
    const ext = matches ? matches[1] : 'jpg';
    const base64Data = coverImage.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = 'cover-' + req.userId + '-' + Date.now() + '.' + ext;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    const coverUrl = `http://localhost:5000/uploads/${filename}`;

    const user = await User.findById(req.userId);
    user.coverImage = coverUrl;
    await user.save();

    res.json({ coverImage: coverUrl });
  } catch (err) {
    console.error('Cover upload error:', err);
    res.status(500).json({ error: err.message });
  }
};