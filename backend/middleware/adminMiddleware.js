// ========================================
// ADMIN AUTHORIZATION MIDDLEWARE
// middleware/adminMiddleware.js
// ========================================

/**
 * Middleware to check if user is admin
 * Must be used after protect middleware
 */
const adminOnly = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login first'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        console.error('Admin Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

/**
 * Middleware to check if user is accessing their own resource or is admin
 */
const ownerOrAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login first'
            });
        }

        const resourceUserId = parseInt(req.params.userId || req.params.id);
        const currentUserId = req.user.id;

        if (req.user.role === 'admin' || currentUserId === resourceUserId) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.'
            });
        }
    } catch (error) {
        console.error('Owner/Admin Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

module.exports = { adminOnly, ownerOrAdmin };