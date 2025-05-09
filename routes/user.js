const express = require('express');
const User = require('../schemas/User');
const createError = require('../utils/createError');
const generateToken = require('../utils/generateToken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

// User registration
router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, address, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, "User already exists"));
        }

        // Create new user
        const newUser = new User({
            email,
            password,
            first_name,
            last_name,
            address,
            phone
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(createError(400, error.message));
        } else {
            next(createError(500, "Error registering user"));
        }
    }
});

// User login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return next(createError(401, "Invalid credentials"));
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(createError(401, "Invalid credentials"));
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: "Login successful",
            token,
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });
    } catch (error) {
        next(createError(500, "Error during login"));
    }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v');
            
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        res.json(user);
    } catch (error) {
        next(createError(500, "Error fetching profile"));
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res, next) => {
    try {
        const allowedUpdates = ['first_name', 'last_name', 'address', 'phone'];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { 
                new: true,
                runValidators: true,
                select: '-password -__v'
            }
        );

        if (!user) {
            return next(createError(404, "User not found"));
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(createError(400, error.message));
        } else {
            next(createError(500, "Error updating profile"));
        }
    }
});

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const users = await User.find()
            .select('-password -__v')
            .sort({ createdAt: -1 });
            
        res.json(users);
    } catch (error) {
        next(createError(500, "Error fetching users"));
    }
});

// Get user by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -__v');
            
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            next(createError(400, "Invalid user ID format"));
        } else {
            next(createError(500, "Error fetching user"));
        }
    }
});

module.exports = router;