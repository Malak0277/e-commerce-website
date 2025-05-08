const express = require('express');
const router = express.Router();
const Order = require('../schemas/Order');



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

module.exports = router;
