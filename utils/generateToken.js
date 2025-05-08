const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;
