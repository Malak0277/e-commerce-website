const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: { type: Number, unique: true },
  user_id: { type: String, ref: 'User', required: true },
  total_price: { type: Number, required: true },
  shipping_address: { type: String, required: true },
  payment_method: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
    required: true
  },
  created_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      number_of_people: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('Order', orderSchema);