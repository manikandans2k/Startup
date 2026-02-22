// ========================================
// AUTHENTICATION ROUTES
// routes/authRoutes.js
// ========================================

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    register,
    login,
    getProfile,
    updateProfile,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;