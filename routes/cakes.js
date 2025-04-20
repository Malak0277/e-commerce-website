const express = require('express');
const router = express.Router();
const path = require('path');


// Simulate a database or data source
const cakesData = {
    birthday: [
        { code: '#B01', source: "../../images/subpages/birthday_images/B01.jpg" },
        { code: '#B02', source: "../../images/subpages/birthday_images/B02.jpg" },
        { code: '#B03', source: "../../images/subpages/birthday_images/B03.jpg" },
        { code: '#B04', source: "../../images/subpages/birthday_images/B04.jpg" },
        { code: '#B05', source: "../../images/subpages/birthday_images/B05.jpg" },
        { code: '#B06', source: "../../images/subpages/birthday_images/B06.jpg" },
    ],
    wedding: [
        { code: '#W06', source: "../../images/subpages/wedding_images/W06.jpeg" },
        { code: '#W07', source: "../../images/subpages/wedding_images/W07.jpeg" },
        { code: '#W08', source: "../../images/subpages/wedding_images/W08.jpeg" },
        { code: '#W09', source: "../../images/subpages/wedding_images/W09.jpeg" },
        { code: '#W10', source: "../../images/subpages/wedding_images/W10.jpeg" },
        { code: '#W11', source: "../../images/subpages/wedding_images/W11.jpeg" },
        { code: '#W12', source: "../../images/subpages/wedding_images/W12.jpeg" },
        { code: '#W13', source: "../../images/subpages/wedding_images/W13.jpeg" },
        { code: '#W14', source: "../../images/subpages/wedding_images/W14.jpeg" },
    
    ],
    // Add more cake types here...
};

// Route to handle dynamic rendering based on cake type
router.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpage.html'));
    
    const { type } = req.query;

    if (type) {
        // If a type is specified, get the corresponding cake data
        const cakes = cakesData[type.toLowerCase()];
        if (cakes) {
            res.json(cakes); // Send the cake data as JSON to be handled by the frontend
        } else {
            res.status(404).send("Cake type not found");
        }
    } else {
        res.status(400).send("Please specify a cake type");
    }
     
});




/*
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
        else if(type === "wedding"){
            res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpages', 'wedding.html'));
        }
        else if(type === "eid"){
            res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpages', 'eid.html'));
        }
        else if(type === "others"){
            res.sendFile(path.join(__dirname, '..', 'public', 'html', 'subpages', 'others.html'));
        }
    }
    else{
        res.send("Get all cakes")
    }
});
*/

 //GET /api/cakes?type=birthday – Get only birthday cakes


 //POST /api/cakes – ➕ (Owner) Add a new cake

 //PUT /api/cakes/:id – 📝 (Owner) Edit a cake

 //DELETE /api/cakes/:id – ❌ (Owner) Delete a cake

 module.exports = router