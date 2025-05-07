const express = require('express');
const app = express();
const cakeRouter = require('./routes/cakes');

const connectDB = require('./config/db');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use('/cakes', cakeRouter);




app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


async function main() {
    const db = await connectDB();
  
    // Example: get all cakes
    const cakes = await db.collection('cakes').find().toArray();
    console.log(cakes);
  }
  
  main();