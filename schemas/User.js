const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: String,
  last_name: String,
  address: String,
  phone: String,
  profile_picture: String,
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);