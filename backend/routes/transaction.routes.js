const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middleware/auth');
const {
  validateTransaction,
  validateUuidParam,
  validateDateRange,
  validatePagination,
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// GET /api/transactions - Get all transactions for current user
router.get(
  '/',
  validateDateRange,
  validatePagination,
  transactionController.getAllTransactions
);

// GET /api/transactions/stats - Get transaction statistics
router.get('/stats', validateDateRange, transactionController.getTransactionStats);

// GET /api/transactions/trends - Get spending trends
router.get('/trends', transactionController.getSpendingTrends);

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', validateUuidParam('id'), transactionController.getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', validateTransaction, transactionController.createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', validateUuidParam('id'), transactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', validateUuidParam('id'), transactionController.deleteTransaction);

module.exports = router;
