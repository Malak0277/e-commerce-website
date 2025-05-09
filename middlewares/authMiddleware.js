const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return next(createError(401, 'No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.user_id }; // Make sure this matches your token payload
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        next(createError(401, 'Invalid token'));
    }
};

module.exports = authMiddleware;