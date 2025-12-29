const express = require('express');
const router = express.Router();

// Import all route files
// Example: const userRoutes = require('./routes/userRoutes');
// Example: const orderRoutes = require('./routes/orderRoutes');

// Register all routes
// Example: router.use('/api/users', userRoutes);
// Example: router.use('/api/orders', orderRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MamasThali API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MamasThali API',
    version: '1.0.0'
  });
});

module.exports = router;

