// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Usar cookie HTTP-only

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user; // Save the user in the request to use in routes
        next();
    });
};

module.exports = authMiddleware;
