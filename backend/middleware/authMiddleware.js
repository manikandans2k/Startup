// ========================================
// AUTHENTICATION MIDDLEWARE
// middleware/authMiddleware.js
// ========================================

const { verifyToken } = require('../utils/jwtHelper');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        try {
            const decoded = verifyToken(token);
            
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name
            };

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token invalid or expired'
            });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

/**
 * Optional authentication
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = verifyToken(token);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    name: decoded.name
                };
            } catch (error) {
                req.user = null;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = { protect, optionalAuth };