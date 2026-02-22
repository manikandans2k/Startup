// ========================================
// ORDER CONTROLLER
// controllers/orderController.js
// ========================================

const { query, transaction } = require('../config/db');

/**
 * @desc    Get all orders (Admin) or user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res) => {
    try {
        let sql, params;

        if (req.user.role === 'admin') {
            // Admin gets all orders
            sql = `
                SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
                FROM orders o
                JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
            `;
            params = [];
        } else {
            // User gets only their orders
            sql = `
                SELECT o.*, u.name as customer_name, u.email as customer_email
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.user_id = ?
                ORDER BY o.created_at DESC
            `;
            params = [req.user.id];
        }

        const orders = await query(sql, params);

        // Get order items for each order
        for (let order of orders) {
            const items = await query(
                'SELECT * FROM order_items WHERE order_id = ?',
                [order.id]
            );
            order.items = items;
        }

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        let sql = `
            SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `;

        // If not admin, also check user_id
        if (req.user.role !== 'admin') {
            sql += ' AND o.user_id = ?';
        }

        const params = req.user.role === 'admin' ? [id] : [id, req.user.id];
        const orders = await query(sql, params);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = orders[0];

        // Get order items
        const items = await query(
            'SELECT * FROM order_items WHERE order_id = ?',
            [id]
        );
        order.items = items;

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Create order from cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get cart items
        const cartItems = await query(
            `SELECT c.*, p.name, p.price, p.stock 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Check stock availability
        for (let item of cartItems) {
            if (item.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order and order items in transaction
        const queries = [];

        // Insert order
        queries.push({
            sql: 'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            params: [userId, total, 'pending']
        });

        const results = await transaction(queries);
        const orderId = results[0].insertId;

        // Insert order items
        for (let item of cartItems) {
            await query(
                `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.name, item.price, item.quantity, item.price * item.quantity]
            );

            // Update product stock
            await query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId,
            total
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        await query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/orders/stats/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
    try {
        const stats = await query('CALL get_dashboard_stats()');

        res.json({
            success: true,
            stats: stats[0][0]
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getDashboardStats
};