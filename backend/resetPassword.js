require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const newHash = await bcrypt.hash('SecurePass123', 10);
    const result = await User.updateOne(
      { email: 'hamna@test.com' },
      { password_hash: newHash }
    );
    console.log('Update result:', result);
    if (result.modifiedCount === 1) {
      console.log('✅ Password for hamna@test.com reset to: SecurePass123');
    } else {
      console.log('⚠️ User not found or password already the same.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

resetPassword();