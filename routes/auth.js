const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createError = require('../utils/createError');
const generateToken = require('../utils/generateToken');
const router = express.Router();


router.post('/signup', async (req, res, next) => {
    const { name, email, password } = req.body; //todo 

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword }); //todo
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({ token }); //todo
});

router.post('/login', async (req, res, next) => {
        const { email, password } = req.body; //todo

        const user = await User.findOne({ email });
        if (!user) return next(createError(401, "Invalid credentials"));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(createError(401, "Invalid credentials"));

        const token = generateToken(user._id);

        res.json({ token }); //todo

});
