const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: { 
    type: Number, 
    unique: true 
  },
  user_id: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  total_price: { 
    type: Number, 
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  shipping_address: { 
    type: String, 
    required: true,
    trim: true
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [
    {
      cake_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cake', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      number_of_people: { 
        type: Number, 
        required: true,
        min: [1, 'Number of people must be at least 1']
      },
      price: { 
        type: Number, 
        required: true,
        min: [0, 'Price cannot be negative']
      }
    }
  ],
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['cash', 'credit_card', 'mobile_payment'],
    required: true
  },
  delivery_date: {
    type: Date,
    required: true
  },
  delivery_notes: {
    type: String,
    trim: true
  },
  discount_applied: {
    code: String,
    amount: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ order_number: 1 });

// Calculate total price before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.total_price = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
