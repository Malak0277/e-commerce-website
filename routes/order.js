const express = require('express');
const router = express.Router();
const Order = require('../schemas/Order');
const Cart = require('../schemas/Cart');
const Cake = require('../schemas/Cake');
const createError = require('../utils/createError');
const getID = require('../utils/idGenerator');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Create a new order
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const orderNumber = await getID('order_number');
        
        const orderData = {
            order_number: orderNumber,
            user_id: req.user.id,
            ...req.body
        };

        const order = new Order(orderData);
        await order.save();

        res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(createError(400, error.message));
        } else {
            next(createError(500, "Error creating order"));
        }
    }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const orders = await Order.find()
        .populate('user_id', 'first_name last_name email')
        .sort({ created_at: -1 });
      res.json(orders);
    } catch (error) {
      next(createError(500, "Error fetching orders"));
    }
  });

// Get user's orders
router.get('/my-orders', authMiddleware, async (req, res, next) => {
    try {
        const orders = await Order.find({ user_id: req.user.id })
            .populate('items.cake_id', 'name price image_url')
            .sort({ created_at: -1 });
            
        res.json(orders);
    } catch (error) {
        next(createError(500, "Error fetching orders"));
    }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.cake_id', 'name price image_url');
            
        if (!order) {
            return next(createError(404, "Order not found"));
        }

        // Check if user is admin or the order owner
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return next(createError(403, "Not authorized to view this order"));
        }
        
        res.json(order);
    } catch (error) {
        if (error.name === 'CastError') {
            next(createError(400, "Invalid order ID format"));
        } else {
            next(createError(500, "Error fetching order"));
        }
    }
});

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return next(createError(400, "Invalid status"));
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { 
                new: true,
                runValidators: true
            }
        ).populate('items.cake_id', 'name price image_url');

        if (!order) {
            return next(createError(404, "Order not found"));
        }

        res.json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            next(createError(400, "Invalid order ID format"));
        } else {
            next(createError(500, "Error updating order status"));
        }
    }
});

// Checkout process
async function checkout(userId, shippingAddress) {
    try {
        // 1. Find the user's cart
        const cart = await Cart.findOne({ user_id: userId });
        
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // 2. Calculate the total price and prepare items
        let totalPrice = 0;
        const items = [];
        
        for (const item of cart.items) {
            const cake = await Cake.findById(item.cake_id);
            if (!cake) {
                throw new Error(`Cake with ID ${item.cake_id} not found`);
            }
            if (!cake.is_available) {
                throw new Error(`Cake ${cake.name} is not available`);
            }
            
            totalPrice += item.quantity * item.price;
            items.push({
                cake_id: item.cake_id,
                quantity: item.quantity,
                number_of_people: item.number_of_people,
                price: item.price
            });
        }

        // 3. Create the order
        const orderNumber = await getID('order_number');
        const order = new Order({
            order_number: orderNumber,
            user_id: userId,
            total_price: totalPrice,
            shipping_address: shippingAddress,
            items: items,
            payment_status: 'pending',
            payment_method: 'cash', // Default payment method
            delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default delivery in 7 days
        });

        await order.save();

        // 4. Clear the cart
        await Cart.deleteOne({ user_id: userId });

        return order;
    } catch (error) {
        throw error;
    }
}

// Checkout route
router.post('/checkout', authMiddleware, async (req, res, next) => {
    try {
        const { shipping_address } = req.body;
        
        if (!shipping_address) {
            return next(createError(400, "Shipping address is required"));
        }

        const order = await checkout(req.user.id, shipping_address);
        
        res.status(201).json({
            message: "Checkout successful",
            order
        });
    } catch (error) {
        next(createError(400, error.message));
    }
});

module.exports = router;
