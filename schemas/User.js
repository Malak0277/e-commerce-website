const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: String, // email as primary key
    required: true
  },
  password: { type: String, required: true },
  first_name: String,
  last_name: String,
  address: String,
  phone: String
});

module.exports = mongoose.model('User', userSchema);
