// ========================================
// USER CONTROLLER
// controllers/userController.js
// ========================================

const { query } = require('../config/db');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await query(
            'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin or Own Profile
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const users = await query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
            [id]
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
        console.error('Get User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin or Own Profile
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role } = req.body;

        const existing = await query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can change user role'
            });
        }

        let sql = 'UPDATE users SET name = ?, email = ?, phone = ?';
        let params = [name, email, phone];

        if (role && req.user.role === 'admin') {
            sql += ', role = ?';
            params.push(role);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await query(sql, params);

        res.json({
            success: true,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const result = await query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get cart items for user
 * @route   GET /api/users/cart
 * @access  Private
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await query(
            `SELECT c.*, p.name, p.price, p.image, p.stock, (p.price * c.quantity) as subtotal
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );

        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        res.json({
            success: true,
            count: cartItems.length,
            items: cartItems,
            total
        });

    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/users/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required'
            });
        }

        const products = await query('SELECT stock FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (products[0].stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        await query(
            `INSERT INTO cart (user_id, product_id, quantity) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [userId, productId, quantity, quantity]
        );

        res.json({
            success: true,
            message: 'Added to cart successfully'
        });

    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/users/cart/:id
 * @access  Private
 */
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        await query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, id, userId]
        );

        res.json({
            success: true,
            message: 'Cart updated successfully'
        });

    } catch (error) {
        console.error('Update Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/users/cart/:id
 * @access  Private
 */
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        res.json({
            success: true,
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/users/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};