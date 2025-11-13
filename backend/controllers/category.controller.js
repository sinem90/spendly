const Category = require('../models/category.model');

/**
 * Get all categories for the current user
 */
const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query;

    const categories = await Category.findByUser(userId, type);

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const category = await Category.findById(id, userId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with this ID',
      });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new category
 */
const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, type, color } = req.body;

    const category = await Category.create({
      userId,
      name,
      type,
      color,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, type, color } = req.body;

    const updatedCategory = await Category.update(id, userId, {
      name,
      type,
      color,
    });

    if (!updatedCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with this ID',
      });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if category has transactions
    const hasTransactions = await Category.hasTransactions(id, userId);
    if (hasTransactions) {
      return res.status(400).json({
        error: 'Cannot delete category',
        message: 'This category has associated transactions and cannot be deleted. Please delete or reassign transactions first.',
      });
    }

    const deletedCategory = await Category.delete(id, userId);
    if (!deletedCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No category found with this ID',
      });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      categoryId: deletedCategory.category_id,
    });
  } catch (error) {
    // Handle foreign key constraint violation
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Cannot delete category',
        message: 'This category has associated transactions and cannot be deleted',
      });
    }
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
