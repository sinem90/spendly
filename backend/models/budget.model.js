const { query } = require('../config/database');

/**
 * Budget Model
 * Handles all database operations for the budgets table
 */
class Budget {
  /**
   * Find budget by ID
   */
  static async findById(budgetId, userId) {
    const result = await query(
      `SELECT b.*, c.name as category_name, c.type as category_type
       FROM budgets b
       JOIN categories c ON b.category_id = c.category_id
       WHERE b.budget_id = $1 AND b.user_id = $2`,
      [budgetId, userId]
    );
    return result.rows[0];
  }

  /**
   * Get all budgets for a user
   */
  static async findByUser(userId, filters = {}) {
    const { categoryId, active } = filters;

    let queryText = `
      SELECT b.*, c.name as category_name, c.type as category_type, c.color
      FROM budgets b
      JOIN categories c ON b.category_id = c.category_id
      WHERE b.user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (categoryId) {
      queryText += ` AND b.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (active) {
      queryText += ` AND CURRENT_DATE BETWEEN b.period_start AND b.period_end`;
    }

    queryText += ` ORDER BY b.period_start DESC`;

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Get active budgets for current period
   */
  static async findActiveBudgets(userId) {
    const result = await query(
      `SELECT b.*, c.name as category_name, c.type as category_type, c.color
       FROM budgets b
       JOIN categories c ON b.category_id = c.category_id
       WHERE b.user_id = $1
         AND CURRENT_DATE BETWEEN b.period_start AND b.period_end
       ORDER BY c.name ASC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Get budget vs actual spending (using the database view)
   */
  static async getBudgetStatus(userId) {
    const result = await query(
      `SELECT * FROM budget_vs_actual WHERE user_id = $1 ORDER BY category_name ASC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Create new budget
   */
  static async create({ userId, categoryId, amount, periodStart, periodEnd }) {
    const result = await query(
      `INSERT INTO budgets (user_id, category_id, amount, period_start, period_end)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, categoryId, amount, periodStart, periodEnd]
    );
    return result.rows[0];
  }

  /**
   * Update budget
   */
  static async update(budgetId, userId, updates) {
    const { categoryId, amount, periodStart, periodEnd } = updates;

    const result = await query(
      `UPDATE budgets
       SET category_id = COALESCE($3, category_id),
           amount = COALESCE($4, amount),
           period_start = COALESCE($5, period_start),
           period_end = COALESCE($6, period_end)
       WHERE budget_id = $1 AND user_id = $2
       RETURNING *`,
      [budgetId, userId, categoryId, amount, periodStart, periodEnd]
    );
    return result.rows[0];
  }

  /**
   * Delete budget
   */
  static async delete(budgetId, userId) {
    const result = await query(
      'DELETE FROM budgets WHERE budget_id = $1 AND user_id = $2 RETURNING budget_id',
      [budgetId, userId]
    );
    return result.rows[0];
  }

  /**
   * Check if budget overlaps with existing budget for same category
   */
  static async checkOverlap(userId, categoryId, periodStart, periodEnd, excludeBudgetId = null) {
    let queryText = `
      SELECT EXISTS(
        SELECT 1 FROM budgets
        WHERE user_id = $1
          AND category_id = $2
          AND (
            (period_start <= $3 AND period_end >= $3)
            OR (period_start <= $4 AND period_end >= $4)
            OR (period_start >= $3 AND period_end <= $4)
          )
    `;
    const params = [userId, categoryId, periodStart, periodEnd];

    if (excludeBudgetId) {
      queryText += ` AND budget_id != $5`;
      params.push(excludeBudgetId);
    }

    queryText += `) as has_overlap`;

    const result = await query(queryText, params);
    return result.rows[0].has_overlap;
  }

  /**
   * Get spending for a specific budget
   */
  static async getSpendingForBudget(budgetId, userId) {
    const result = await query(
      `SELECT
         b.budget_id,
         b.amount as budget_amount,
         c.name as category_name,
         COALESCE(SUM(t.amount), 0) as spent_amount,
         CASE
           WHEN b.amount = 0 THEN 0
           ELSE ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100), 2)
         END as percentage_used
       FROM budgets b
       JOIN categories c ON b.category_id = c.category_id
       LEFT JOIN transactions t ON t.category_id = b.category_id
         AND t.type = 'expense'
         AND t.transaction_date BETWEEN b.period_start AND b.period_end
       WHERE b.budget_id = $1 AND b.user_id = $2
       GROUP BY b.budget_id, b.amount, c.name`,
      [budgetId, userId]
    );
    return result.rows[0];
  }
}

module.exports = Budget;
