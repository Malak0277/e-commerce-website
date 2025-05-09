const mongoose = require('mongoose');
const User = require('../schemas/User'); // adjust path as needed
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const newUser = new User({
      first_name: "Mariam",
      last_name: "Omar",
      email: "mariam@example.com",
      password: "StrongPassword123", 
      address: "123 Main St, Anytown, USA",
      phone: "01234567890"
    });

    await newUser.save();
    console.log('User inserted successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
