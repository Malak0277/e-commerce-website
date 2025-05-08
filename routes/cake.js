const express = require('express');
const router = express.Router();
const Cake = require('../schemas/Cake');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const createError = require('../utils/createError');

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
    const { type } = req.query;
    if (type) {
        const cakes = await Cake.find({ category: type });
        res.json(cakes);
    } else {
        const cakes = await Cake.find();
        res.json(cakes);
    }
});

router.get('/:id', async (req, res, next) => { //todo
    const cake = await Cake.findById(req.params.id);
    if (!cake){
        return next(createError(404, "Cake not found"));
    }
    res.json(cake);
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => { //todo
    const cake = new Cake(req.body);
    await cake.save();
    res.status(201).json(cake);
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => { //todo
    const cake = await Cake.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!cake) {
        return next(createError(404, "Cake not found"));
    }
    res.json(cake);
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => { //todo
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) {
        return next(createError(404, "Cake not found"));
    }
    res.json({ message: 'Cake deleted successfully' });
});



 module.exports = router