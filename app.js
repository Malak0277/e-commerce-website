require('dotenv').config() 
const express = require('express')
const connectDB = require('./config/database');
const mongoose = require('mongoose');

const app = express();

const cakeRouter = require('./routes/cake');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/order');
const cartRouter = require('./routes/cart');
const discountRouter = require('./routes/discount');
const reviewRouter = require('./routes/review');

// Database
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

// Routes
app.use('/cake', cakeRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);
app.use('/cart', cartRouter);
app.use('/discount', discountRouter);
app.use('/review', reviewRouter);

app.get('/home', (req, res) => {
    res.redirect('html/home.html');
})

app.get('/', (req, res) => {
    res.redirect('html/login.html');
})


const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
*/

module.exports = app;