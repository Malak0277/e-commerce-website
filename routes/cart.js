const express = require('express');
const Cart = require('../schemas/Cart');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const createError = require('../utils/createError');
const User = require('../schemas/User');
const Cake = require('../schemas/Cake');
const Discount = require('../schemas/Discount');

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user.id })
            .populate('items.cake_id');
        
        if (!cart) {
            cart = new Cart({
                user_id: req.user.id,
                items: []
            });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Cart error:', error);
        next(createError(500, error.message));
    }
});

router.post('/add', authMiddleware, async (req, res, next) => {
    try {
        const { cakeId, quantity = 1 } = req.body;
        
        const cake = await Cake.findById(cakeId);
        if (!cake) {
            return next(createError(404, "Cake not found"));
        }

        // Check stock availability
        if (cake.stock === 0) {
            return next(createError(400, "Empty stock"));
        }
        if (cake.stock < quantity) {
            return next(createError(400, `Only ${cake.stock} items available in stock`));
        }

        let cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            cart = new Cart({ user_id: req.user.id });
        }

        const existingItem = cart.items.find(item => 
            item.cake_id.toString() === cakeId
        );
        
        if (existingItem) {
            // Check if adding the new quantity would exceed stock
            if (cake.stock < existingItem.quantity + quantity) {
                return next(createError(400, `Only ${cake.stock - existingItem.quantity} more items available in stock`));
            }
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                cake_id: cakeId,
                name: cake.name,
                quantity: quantity,
                price: cake.price
            });
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.cake_id');
        res.json({ message: "Item added to cart", cart: populatedCart });
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.put('/update/:cakeId', authMiddleware, async (req, res, next) => {
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
        const populatedCart = await Cart.findById(cart._id).populate('items.cake_id');
        res.json(populatedCart);
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.delete('/remove/:cakeId', authMiddleware, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        cart.items = cart.items.filter(item => 
            item.cake_id.toString() !== req.params.cakeId
        );
        
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.cake_id');
        res.json(populatedCart);
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.delete('/clear', authMiddleware, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        
        if (!cart) {
            return next(createError(404, "Cart not found"));
        }

        cart.items = [];
        await cart.save();
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        next(createError(400, error.message));
    }
});

router.post('/apply-discount', authMiddleware, async (req, res, next) => {
    try {
        const { code } = req.body;
        console.log('Received discount code request:', code);

        // Only validate the discount code
        const discount = await Discount.findOne({ 
            code,
            expiry: { $gt: new Date() }
        });

        if (!discount) {
            console.log('Discount not found or expired:', code);
            return next(createError(404, "Invalid or expired discount code"));
        }

        console.log('Found valid discount:', discount);

        // Return only the discount info, no cart update needed
        res.json({
            discount: {
                code: discount.code,
                percentage: discount.percentage,
                description: `Save ${discount.percentage}% on your order`
            }
        });
    } catch (error) {
        console.error('Error in apply-discount:', error);
        next(createError(400, error.message));
    }
});

module.exports = router;