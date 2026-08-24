const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '' }, // URL to avatar image
  coverImage: { type: String, default: '' }, // URL to cover image
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  privacy_settings: { type: Object, default: { profile: 'public', posts: 'public' } },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);