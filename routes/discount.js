const express = require('express');
const router = express.Router();
const Discount = require('../schemas/Discount');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const createError = require('../utils/createError');

// Create a new discount (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => { //todo
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.status(201).json(discount);
    } catch (error) {
        next(createError(400, error.message));
    }
});

// Get all active discounts
router.get('/', authMiddleware, adminMiddleware, async (req, res) => { //todo
    try {
        const currentDate = new Date();
        const discounts = await Discount.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
            isActive: true
        });
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Get a specific discount
// router.get('/:code', async (req, res, next) => {
//     try {
//         const discount = await Discount.findOne({ 
//             code: req.params.code,
//             isActive: true,
//             startDate: { $lte: new Date() },
//             endDate: { $gte: new Date() }
//         });
        
//         if (!discount) {
//             return next(createError(404, "Discount not found or expired"));
//         }
        
//         res.json(discount);
//     } catch (error) {
//         next(createError(500, error.message));
//     }
// });


router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => { //todo
    try {
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!discount) {
            return next(createError(404, "Discount not found"));
        }
        
        res.json(discount);
    } catch (error) {
        next(createError(400, error.message));
    }
});

// Delete a discount (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => { //todo
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        
        if (!discount) {
            return next(createError(404, "Discount not found"));
        }
        
        res.json({ message: "Discount deleted successfully" });
    } catch (error) {
        next(createError(500, error.message));
    }
});

module.exports = router;
