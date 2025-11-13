const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const budgetRoutes = require('./budget.routes');
const transactionRoutes = require('./transaction.routes');

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Spendly API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      budgets: '/api/budgets',
      transactions: '/api/transactions',
    },
    documentation: 'See README.md for full API documentation',
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
