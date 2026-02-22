// ========================================
// USER ROUTES
// routes/userRoutes.js
// ========================================

const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, ownerOrAdmin } = require('../middleware/adminMiddleware');

// Cart routes (user only)
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:id', protect, updateCartItem);
router.delete('/cart/:id', protect, removeFromCart);
router.delete('/cart', protect, clearCart);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, ownerOrAdmin, getUserById);
router.put('/:id', protect, ownerOrAdmin, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;