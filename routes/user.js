const express = require('express');
const User = require('../schemas/User');
const createError = require('../utils/createError');
const generateToken = require('../utils/generateToken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/signup', async (req, res, next) => { //todo? 
    const { first_name, last_name, email, password } = req.body; 

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ first_name, last_name, email, password: hashedPassword }); 
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({ token }); 
});

router.post('/login', async (req, res, next) => { //todo?
        const { email, password } = req.body; 

        const user = await User.findOne({ email });
        if (!user) return next(createError(401, "Invalid credentials"));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(createError(401, "Invalid credentials"));

        const token = generateToken(user._id);

        res.json({ token }); 

});


router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(createError(404, 'User not found'));
        }
        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        next(createError(500, 'Error fetching profile'));
    }
});

router.put('/profile', authMiddleware, async (req, res) => { //todo?
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
});


router.get('/', authMiddleware, adminMiddleware, async (req, res) => { //todo
    const users = await User.find();
    res.json(users);
});

router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => { //todo
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;