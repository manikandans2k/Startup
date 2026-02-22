// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Start listening
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

module.exports = app;
// ```

// **Instructions:**
// 1. In the `backend` folder (root of backend)
// 2. Create a file `server.js`
// 3. Copy-paste the above code

// ---

// ## 🎉 BACKEND COMPLETE! 

// ### ✅ What You've Created:

// Your complete backend folder structure:
// ```
// backend/
// ├── config/
// │   └── db.js
// ├── controllers/
// │   ├── authController.js
// │   ├── orderController.js
// │   ├── productController.js
// │   └── userController.js
// ├── middleware/
// │   ├── adminMiddleware.js
// │   └── authMiddleware.js
// ├── routes/
// │   ├── authRoutes.js
// │   ├── orderRoutes.js
// │   ├── productRoutes.js
// │   └── userRoutes.js
// ├── utils/
// │   └── jwtHelper.js
// ├── .env
// ├── package.json
// └── server.js