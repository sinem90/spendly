const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { validateUuidParam } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUuidParam('id'), userController.getUserById);

// PUT /api/users/:id - Update user profile
router.put('/:id', validateUuidParam('id'), userController.updateUser);

// DELETE /api/users/:id - Delete user account
router.delete('/:id', validateUuidParam('id'), userController.deleteUser);

module.exports = router;
