const express = require('express');
const app = express();
const cakeRouter = require('./routes/cakes');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use('/cakes', cakeRouter);



app.get('/home', (req, res) => {
    res.redirect('html/home.html');
})

app.get('/', (req, res) => {
    
    res.redirect('html/home.html');
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});