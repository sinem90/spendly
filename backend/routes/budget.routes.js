const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { authenticate } = require('../middleware/auth');
const { validateBudget, validateUuidParam } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// GET /api/budgets - Get all budgets for current user
router.get('/', budgetController.getAllBudgets);

// GET /api/budgets/active - Get active budgets for current period
router.get('/active', budgetController.getActiveBudgets);

// GET /api/budgets/status - Get budget vs actual spending
router.get('/status', budgetController.getBudgetStatus);

// GET /api/budgets/:id - Get budget by ID
router.get('/:id', validateUuidParam('id'), budgetController.getBudgetById);

// POST /api/budgets - Create new budget
router.post('/', validateBudget, budgetController.createBudget);

// PUT /api/budgets/:id - Update budget
router.put('/:id', validateUuidParam('id'), budgetController.updateBudget);

// DELETE /api/budgets/:id - Delete budget
router.delete('/:id', validateUuidParam('id'), budgetController.deleteBudget);

module.exports = router;
