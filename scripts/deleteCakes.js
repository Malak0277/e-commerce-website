const mongoose = require('mongoose');
const Cake = require('../schemas/Cake');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function deleteCakes() {
  try {
    // Delete all cakes
    await Cake.deleteMany({});
    console.log('All cakes deleted successfully');
    
    // Or delete by category
    // await Cake.deleteMany({ category: 'birthday' });
    // console.log('All birthday cakes deleted successfully');
    
    // Or delete by ID
    // await Cake.findByIdAndDelete('cake_id_here');
    // console.log('Specific cake deleted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error deleting cakes:', error);
    process.exit(1);
  }
}

// Uncomment the method you want to use
deleteCakes(); 