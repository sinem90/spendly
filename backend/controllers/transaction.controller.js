const Transaction = require('../models/transaction.model');
const Category = require('../models/category.model');

/**
 * Get all transactions for the current user
 */
const getAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { categoryId, type, startDate, endDate, limit, offset } = req.query;

    const transactions = await Transaction.findByUser(userId, {
      categoryId,
      type,
      startDate,
      endDate,
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0,
    });

    const totalCount = await Transaction.getCount(userId, {
      categoryId,
      type,
      startDate,
      endDate,
    });

    res.status(200).json({
      count: transactions.length,
      total: totalCount,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction statistics
 */
const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    // Get spending by category
    const spendingByCategory = await Transaction.getSpendingByCategory(
      userId,
      startDate || '1900-01-01',
      endDate || '2100-12-31'
    );

    // Calculate totals
    const totalExpenses = spendingByCategory.reduce(
      (sum, cat) => sum + parseFloat(cat.total_amount),
      0
    );

    res.status(200).json({
      totalExpenses,
      categoriesCount: spendingByCategory.length,
      byCategory: spendingByCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get spending trends
 */
const getSpendingTrends = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { months } = req.query;

    const trends = await Transaction.getMonthlyTrend(
      userId,
      parseInt(months) || 6
    );

    res.status(200).json({
      count: trends.length,
      trends,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction by ID
 */
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(id, userId);
    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: 'No transaction found with this ID',
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new transaction
 */
const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { categoryId, amount, description, transactionDate, type } = req.body;

    // Verify category exists and belongs to user
    const category = await Category.findById(categoryId, userId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The specified category does not exist',
      });
    }

    // Verify category type matches transaction type
    if (category.type !== type) {
      return res.status(400).json({
        error: 'Category type mismatch',
        message: `Cannot create ${type} transaction for ${category.type} category`,
      });
    }

    const transaction = await Transaction.create({
      userId,
      categoryId,
      amount,
      description,
      transactionDate,
      type,
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update transaction
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { categoryId, amount, description, transactionDate, type } = req.body;

    // Check if transaction exists
    const existingTransaction = await Transaction.findById(id, userId);
    if (!existingTransaction) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: 'No transaction found with this ID',
      });
    }

    // If updating category, verify it exists and type matches
    if (categoryId) {
      const category = await Category.findById(categoryId, userId);
      if (!category) {
        return res.status(404).json({
          error: 'Category not found',
          message: 'The specified category does not exist',
        });
      }

      const finalType = type || existingTransaction.type;
      if (category.type !== finalType) {
        return res.status(400).json({
          error: 'Category type mismatch',
          message: `Cannot use ${category.type} category for ${finalType} transaction`,
        });
      }
    }

    const updatedTransaction = await Transaction.update(id, userId, {
      categoryId,
      amount,
      description,
      transactionDate,
      type,
    });

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete transaction
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedTransaction = await Transaction.delete(id, userId);
    if (!deletedTransaction) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: 'No transaction found with this ID',
      });
    }

    res.status(200).json({
      message: 'Transaction deleted successfully',
      transactionId: deletedTransaction.transaction_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionStats,
  getSpendingTrends,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
