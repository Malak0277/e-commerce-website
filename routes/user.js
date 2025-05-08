const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

router.put('/profile', authMiddleware, async (req, res) => {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
});

module.exports = router;