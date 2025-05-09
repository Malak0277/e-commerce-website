const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(
        { user_id: userId }, // Make sure this matches what authMiddleware expects
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = generateToken;
