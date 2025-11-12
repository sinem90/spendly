const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * User registration validation
 */
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  validate,
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Category validation
 */
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name is required and must be less than 100 characters'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code'),
  validate,
];

/**
 * Transaction validation
 */
const validateTransaction = [
  body('categoryId')
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be less than 255 characters'),
  body('transactionDate')
    .isISO8601()
    .withMessage('Valid transaction date is required'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  validate,
];

/**
 * Budget validation
 */
const validateBudget = [
  body('categoryId')
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),
  body('periodStart')
    .isISO8601()
    .withMessage('Valid period start date is required'),
  body('periodEnd')
    .isISO8601()
    .withMessage('Valid period end date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.periodStart)) {
        throw new Error('Period end date must be after period start date');
      }
      return true;
    }),
  validate,
];

/**
 * UUID param validation
 */
const validateUuidParam = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`Valid ${paramName} is required`),
  validate,
];

/**
 * Date range query validation
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  validate,
];

/**
 * Pagination query validation
 */
const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  validate,
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateCategory,
  validateTransaction,
  validateBudget,
  validateUuidParam,
  validateDateRange,
  validatePagination,
};
