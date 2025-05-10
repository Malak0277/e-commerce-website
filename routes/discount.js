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

router.get('/', authMiddleware, adminMiddleware, async (req, res) => { //todo
    try {
        const discounts = await Discount.find();
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const discount = await Discount.findById(req.params.id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.json(discount);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

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
