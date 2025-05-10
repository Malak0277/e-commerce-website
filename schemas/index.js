const mongoose = require('mongoose');
const User = require('./User');
const Cake = require('./Cake');
const Order = require('./Order');
const Cart = require('./Cart');
const Counter = require('./Counter');
const Discount = require('./Discount');
const Review = require('./Review');

// Export all schemas
module.exports = {
  User,
  Cake,
  Order,
  Cart,
  Counter,
  Discount,
  Review,
  mongoose
};

// Initialize database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
