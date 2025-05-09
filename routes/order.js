const express = require('express');
const router = express.Router();
const Order = require('../schemas/Order');
const Cart = require('../schemas/Cart');
const Cake = require('../schemas/Cake');
//const getID = require('../utils/idGenerator');


router.post('/', async (req, res) => { //todo
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/', async (req, res) => { //todo
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.get('/:id', async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// router.put('/:id', async (req, res) => {
//     try {
//         const order = await Order.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.json(order);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });


// router.delete('/:id', async (req, res) => {
//     try {
//         const order = await Order.findByIdAndDelete(req.params.id);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



async function createOrder(userId, orderData) {
  const orderNumber = await getID('order_number');

  const newOrder = new Order({
    order_number: orderNumber,
    user_id: userId,
    ...orderData
  });

  await newOrder.save();
  return newOrder;
}

async function checkout(userId, shippingAddress) {
    // 1. Find the user's cart
    const cart = await Cart.findOne({ user_id: userId });
  
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
  
    // 2. Calculate the total price from cart items
    let totalPrice = 0;
    const items = [];
    
    for (const item of cart.items) {
      const cake = await Cake.findById(item.cake_id);
      if (!cake) {
        throw new Error('Cake not found');
      }
      totalPrice += item.quantity * item.price;
      items.push({
        cake_id: item.cake_id,
        quantity: item.quantity,
        price: item.price
      });
    }
  
    // 3. Create the order from cart
    const order = new Order({
      user_id: userId,
      total_price: totalPrice,
      shipping_address: shippingAddress,
      items: items
    });
  
    // Save the order to MongoDB
    await order.save();
  
    // 4. Clear the cart after the order is created
    await Cart.deleteOne({ user_id: userId });
  
    console.log('Order created and cart cleared');
    return order;
  }


module.exports = router;
