const mongoose = require('mongoose');
require('dotenv').config(); // from.env

// Test if environment variables are loaded
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;


//root:<root1234>@cluster0.pd2teea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0