// ========================================
// AUTHENTICATION CONTROLLER
// controllers/authController.js
// ========================================

const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { generateToken } = require('../utils/jwtHelper');
const { validationResult } = require('express-validator');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await query(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, hashedPassword, 'user']
        );

        // Generate JWT token
        const token = generateToken({
            id: result.insertId,
            email: email,
            role: 'user',
            name: name
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                name,
                email,
                phone,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * @desc    Login user/admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password, loginType } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const users = await query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check login type
        if (loginType === 'admin' && user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        if (loginType === 'user' && user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Please use admin login'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, currentPassword, newPassword } = req.body;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required to change password'
                });
            }

            const users = await query('SELECT password FROM users WHERE id = ?', [userId]);
            const isMatch = await bcrypt.compare(currentPassword, users[0].password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await query(
                'UPDATE users SET name = ?, phone = ?, password = ? WHERE id = ?',
                [name, phone, hashedPassword, userId]
            );
        } else {
            await query(
                'UPDATE users SET name = ?, phone = ? WHERE id = ?',
                [name, phone, userId]
            );
        }

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    logout
};