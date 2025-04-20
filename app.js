const express = require('express');
const app = express();
const cakeRouter = require('./routes/cakes');
//const db = require('./schemas/index');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/cakes', cakeRouter);




app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});