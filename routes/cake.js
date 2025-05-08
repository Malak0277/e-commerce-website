const express = require('express');
const router = express.Router();
const path = require('path');
const Cake = require('../schemas/cake');


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
router.get("/", async (req, res) => {
    try {
        const { type } = req.query;
        if (type) {
            
            const cakes = await Cake.find({ category_name: type });
            res.json(cakes);
        } else {
            const cakes = await Cake.find();
            res.json(cakes);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
*/








/*
// GET a specific cake by ID
router.get("/:id", async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (cake) {
            res.json(cake);
        } else {
            res.status(404).json({ message: "Cake not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Add a new cake (for admin/owner)
router.post("/", async (req, res) => {
    const cake = new Cake({
        code: req.body.code,
        type: req.body.type,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });

    try {
        const newCake = await cake.save();
        res.status(201).json(newCake);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT - Update a cake (for admin/owner)
router.put("/:id", async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (cake) {
            Object.assign(cake, req.body);
            const updatedCake = await cake.save();
            res.json(updatedCake);
        } else {
            res.status(404).json({ message: "Cake not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Remove a cake (for admin/owner)
router.delete("/:id", async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (cake) {
            await cake.remove();
            res.json({ message: "Cake deleted" });
        } else {
            res.status(404).json({ message: "Cake not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search cakes by name or description
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        const cakes = await Cake.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(cakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get cakes with filtering and sorting
router.get("/filter", async (req, res) => {
    try {
        const { type, minPrice, maxPrice, sortBy } = req.query;
        let query = {};

        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        let sort = {};
        if (sortBy) {
            sort[sortBy] = 1; // 1 for ascending, -1 for descending
        }

        const cakes = await Cake.find(query).sort(sort);
        res.json(cakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

*/



 //GET /api/cakes?type=birthday – Get only birthday cakes


 //POST /api/cakes – ➕ (Owner) Add a new cake

 //PUT /api/cakes/:id – 📝 (Owner) Edit a cake

 //DELETE /api/cakes/:id – ❌ (Owner) Delete a cake

 module.exports = router