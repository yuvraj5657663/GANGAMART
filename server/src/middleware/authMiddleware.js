const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check karein ki headers mein token hai ya nahi
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer TOKEN_VALUE" se token nikaalein
            token = req.headers.authorization.split(' ')[1];

            // Token decode karein
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User ka data request object mein daal dein (password hata kar)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };