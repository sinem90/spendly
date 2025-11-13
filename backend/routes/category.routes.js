const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth');
const { validateCategory, validateUuidParam } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// GET /api/categories - Get all categories for current user
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', validateUuidParam('id'), categoryController.getCategoryById);

// POST /api/categories - Create new category
router.post('/', validateCategory, categoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', validateUuidParam('id'), categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', validateUuidParam('id'), categoryController.deleteCategory);

module.exports = router;
