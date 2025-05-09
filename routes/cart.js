const express = require('express');
const Cart = require('../schemas/Cart');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const createError = require('../utils/createError');
const User = require('../schemas/User');
const Cake = require('../schemas/Cake');
const Discount = require('../schemas/Discount');

router.get('/', authMiddleware, async (req, res, next) => { //todo
    try {
        let cart = await Cart.findOne({ user_id: req.user.id })
            .populate('items.cake_id');
        
        if (!cart) {
            cart = new Cart({ user_id: req.user.id });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        next(createError(500, error.message));
    }
});

router.post('/add', authMiddleware, async (req, res, next) => { //todo
    try {
        const { cakeId, quantity } = req.body;
        
        // Check if cake exists
        const cake = await Cake.findById(cakeId);
        if (!cake) {
            return next(createError(404, "Cake not found"));
        }

        let cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            cart = new Cart({ user_id: req.user.id });
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(item => 
            item.cake_id.toString() === cakeId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                cake_id: cakeId,
                quantity,
                price: cake.price
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.put('/update/:cakeId', authMiddleware, async (req, res, next) => { //todo
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        const cartItem = cart.items.find(item => 
            item.cake_id.toString() === req.params.cakeId
        );
        
        if (!cartItem) {
            return next(createError(404, "Item not found in cart"));
        }

        cartItem.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.delete('/remove/:cakeId', authMiddleware, async (req, res, next) => { //todo
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        cart.items = cart.items.filter(item => 
            item.cake_id.toString() !== req.params.cakeId
        );
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.delete('/clear', authMiddleware, async (req, res, next) => { //todo
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        cart.items = [];
        cart.discountCode = null;
        cart.discountAmount = 0;
        
        await cart.save();
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.post('/apply-discount', authMiddleware, async (req, res, next) => {
    try {
        const { code } = req.body;
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        const discount = await Discount.findOne({ 
            code,
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        if (!discount) {
            return next(createError(404, "Invalid or expired discount code"));
        }

        cart.discountCode = code;
        cart.discountAmount = (cart.totalAmount * discount.percentage) / 100;
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;