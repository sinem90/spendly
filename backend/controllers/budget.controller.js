const Budget = require('../models/budget.model');
const Category = require('../models/category.model');

/**
 * Get all budgets for the current user
 */
const getAllBudgets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { categoryId, active } = req.query;

    const budgets = await Budget.findByUser(userId, {
      categoryId,
      active: active === 'true',
    });

    res.status(200).json({
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active budgets for current period
 */
const getActiveBudgets = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const budgets = await Budget.findActiveBudgets(userId);

    res.status(200).json({
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget vs actual spending status
 */
const getBudgetStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const budgetStatus = await Budget.getBudgetStatus(userId);

    res.status(200).json({
      count: budgetStatus.length,
      budgets: budgetStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget by ID
 */
const getBudgetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const budget = await Budget.findById(id, userId);
    if (!budget) {
      return res.status(404).json({
        error: 'Budget not found',
        message: 'No budget found with this ID',
      });
    }

    // Get spending details for this budget
    const spending = await Budget.getSpendingForBudget(id, userId);

    res.status(200).json({
      ...budget,
      spending,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new budget
 */
const createBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { categoryId, amount, periodStart, periodEnd } = req.body;

    // Verify category exists and belongs to user
    const category = await Category.findById(categoryId, userId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The specified category does not exist',
      });
    }

    // Check for overlapping budgets
    const hasOverlap = await Budget.checkOverlap(userId, categoryId, periodStart, periodEnd);
    if (hasOverlap) {
      return res.status(400).json({
        error: 'Overlapping budget',
        message: 'A budget already exists for this category during the specified period',
      });
    }

    const budget = await Budget.create({
      userId,
      categoryId,
      amount,
      periodStart,
      periodEnd,
    });

    res.status(201).json({
      message: 'Budget created successfully',
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget
 */
const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { categoryId, amount, periodStart, periodEnd } = req.body;

    // Check if budget exists
    const existingBudget = await Budget.findById(id, userId);
    if (!existingBudget) {
      return res.status(404).json({
        error: 'Budget not found',
        message: 'No budget found with this ID',
      });
    }

    // If updating category or dates, check for overlaps
    if (categoryId || periodStart || periodEnd) {
      const finalCategoryId = categoryId || existingBudget.category_id;
      const finalPeriodStart = periodStart || existingBudget.period_start;
      const finalPeriodEnd = periodEnd || existingBudget.period_end;

      const hasOverlap = await Budget.checkOverlap(
        userId,
        finalCategoryId,
        finalPeriodStart,
        finalPeriodEnd,
        id
      );

      if (hasOverlap) {
        return res.status(400).json({
          error: 'Overlapping budget',
          message: 'A budget already exists for this category during the specified period',
        });
      }
    }

    const updatedBudget = await Budget.update(id, userId, {
      categoryId,
      amount,
      periodStart,
      periodEnd,
    });

    res.status(200).json({
      message: 'Budget updated successfully',
      budget: updatedBudget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete budget
 */
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedBudget = await Budget.delete(id, userId);
    if (!deletedBudget) {
      return res.status(404).json({
        error: 'Budget not found',
        message: 'No budget found with this ID',
      });
    }

    res.status(200).json({
      message: 'Budget deleted successfully',
      budgetId: deletedBudget.budget_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBudgets,
  getActiveBudgets,
  getBudgetStatus,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
};
