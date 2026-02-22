// ========================================
// ORDER ROUTES
// routes/orderRoutes.js
// ========================================

const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getDashboardStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Protected routes
router.get('/', protect, getOrders);
router.get('/stats/dashboard', protect, adminOnly, getDashboardStats);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);

// Admin routes
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;