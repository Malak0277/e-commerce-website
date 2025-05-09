const mongoose = require('mongoose');

// Define the schema for a cart item
const cartItemSchema = new mongoose.Schema({
  cake_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
  quantity: { type: Number, default: 1 },
  number_of_people: { type: Number, default: 6 },
  price: { type: Number, required: true }
});

// Define the schema for the cart
const cartSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: 'User' },
  items: [cartItemSchema] // An array of cart items
});

// Ensure that a user can only have one cart (unique user_id)
cartSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
