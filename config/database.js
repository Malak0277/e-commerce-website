const mongoose = require('mongoose');
require('dotenv').config(); // from.env

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, just log the error
    console.error('Please check your MongoDB connection and try again');
  }
};

module.exports = connectDB;


//root:<root1234>@cluster0.pd2teea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0