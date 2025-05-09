const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  cake_id: { 
    type: Number, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [3, 'Cake name must be at least 3 characters long']
  },
  category_name: { 
    type: String, 
    required: true,
    enum: ['birthday', 'wedding', 'anniversary', 'graduation', 'other']
  },
  description: { 
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative']
  },
  image_url: { 
    type: String, 
    required: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  serving_size: {
    type: Number,
    required: true,
    min: [1, 'Serving size must be at least 1']
  },
  is_available: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
cakeSchema.index({ category_name: 1, name: 1 });
cakeSchema.index({ price: 1 });

module.exports = mongoose.model('Cake', cakeSchema);
