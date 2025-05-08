const express = require('express');
const router = express.Router();
const Cake = require('../schemas/Cake');
const adminMiddleware = require('../middlewares/adminMiddleware');


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
};


/*
router.get("/", async(req, res) => {    
    const { type } = req.query;

    if (type) {
        const cakes = cakesData[type.toLowerCase()];
        if (cakes) {
            res.json(cakes);
        } else {
            res.status(404).send("Cake type not found");
        }
    } else {
        res.status(400).send("Please specify a cake type");
    }
     
});
*/



router.get("/", async (req, res) => {
    try {
        const { type } = req.query;
        if (type) {
            const cakes = await Cake.find({ category: type });
            res.json(cakes);
        } else {
            const cakes = await Cake.find();
            res.json(cakes);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (!cake) return res.status(404).json({ message: "Cake not found" });
        res.json(cake);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', adminMiddleware, async (req, res) => {
    try {
        const newCake = new Cake(req.body);
        const savedCake = await newCake.save();
        res.status(201).json(savedCake);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', adminMiddleware, async (req, res) => {
    try {
        const updatedCake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCake) return res.status(404).json({ message: "Cake not found" });
        res.json(updatedCake);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const deletedCake = await Cake.findByIdAndDelete(req.params.id);
        if (!deletedCake) return res.status(404).json({ message: "Cake not found" });
        res.json({ message: "Cake deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



 module.exports = router