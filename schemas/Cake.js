const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image_url: { type: String, required: true }
});

module.exports = mongoose.model('Cake', cakeSchema);
