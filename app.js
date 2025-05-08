require('dotenv').config() 
const express = require('express')
const app = express();
const cakeRouter = require('./routes/cake');
const connectDB = require('./config/database');

// Connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use('/cake', cakeRouter);

app.get('/home', (req, res) => {
    res.redirect('html/home.html');
})

app.get('/', (req, res) => {
    res.redirect('html/login.html');
})

// Add after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});