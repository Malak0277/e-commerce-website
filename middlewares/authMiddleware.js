const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createError(401, 'No token provided'));
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Make sure we're setting the user ID correctly
        req.user = {
            id: decoded.user_id
        };
        
        next();
    } catch (error) {
        next(createError(401, 'Invalid token'));
    }
};

module.exports = authMiddleware;