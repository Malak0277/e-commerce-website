const express = require('express');
const router = express.Router();
const path = require('path');


router.get("/", (req, res) => {  //Get all cakes
    //const filteredCakes = [...data.cakes]
    const {type} = req.query
    if(type){
        if(type === "birthday"){
            res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpages', 'birthday.html'));
        }
        else if(type === "minis"){
            res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpages', 'minis.html'));
        }
    }
    else{
        res.send("Get all cakes")
    }
});

 //GET /api/cakes?type=birthday – Get only birthday cakes


router.get("/birthday", (req, res) => {  //Get all cakes
    res.sendFile(__dirname + '/public/html/subpage/birthday.html');
});



 //POST /api/cakes – ➕ (Owner) Add a new cake

 //PUT /api/cakes/:id – 📝 (Owner) Edit a cake

 //DELETE /api/cakes/:id – ❌ (Owner) Delete a cake

 module.exports = router