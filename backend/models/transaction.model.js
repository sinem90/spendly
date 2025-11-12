const { query } = require('../config/database');

/**
 * Transaction Model
 * Handles all database operations for the transactions table
 */
class Transaction {
  /**
   * Find transaction by ID
   */
  static async findById(transactionId, userId) {
    const result = await query(
      `SELECT t.*, c.name as category_name, c.color as category_color
       FROM transactions t
       JOIN categories c ON t.category_id = c.category_id
       WHERE t.transaction_id = $1 AND t.user_id = $2`,
      [transactionId, userId]
    );
    return result.rows[0];
  }

  /**
   * Get all transactions for a user with optional filters
   */
  static async findByUser(userId, filters = {}) {
    const { categoryId, type, startDate, endDate, limit = 50, offset = 0 } = filters;

    let queryText = `
      SELECT t.*, c.name as category_name, c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (categoryId) {
      queryText += ` AND t.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (type) {
      queryText += ` AND t.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (startDate) {
      queryText += ` AND t.transaction_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      queryText += ` AND t.transaction_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    queryText += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Create new transaction
   */
  static async create({ userId, categoryId, amount, description, transactionDate, type }) {
    const result = await query(
      `INSERT INTO transactions (user_id, category_id, amount, description, transaction_date, type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, categoryId, amount, description, transactionDate, type]
    );
    return result.rows[0];
  }

  /**
   * Update transaction
   */
  static async update(transactionId, userId, updates) {
    const { categoryId, amount, description, transactionDate, type } = updates;

    const result = await query(
      `UPDATE transactions
       SET category_id = COALESCE($3, category_id),
           amount = COALESCE($4, amount),
           description = COALESCE($5, description),
           transaction_date = COALESCE($6, transaction_date),
           type = COALESCE($7, type),
           updated_at = NOW()
       WHERE transaction_id = $1 AND user_id = $2
       RETURNING *`,
      [transactionId, userId, categoryId, amount, description, transactionDate, type]
    );
    return result.rows[0];
  }

  /**
   * Delete transaction
   */
  static async delete(transactionId, userId) {
    const result = await query(
      'DELETE FROM transactions WHERE transaction_id = $1 AND user_id = $2 RETURNING transaction_id',
      [transactionId, userId]
    );
    return result.rows[0];
  }

  /**
   * Get transaction count for a user
   */
  static async getCount(userId, filters = {}) {
    const { categoryId, type, startDate, endDate } = filters;

    let queryText = 'SELECT COUNT(*) as count FROM transactions WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (categoryId) {
      queryText += ` AND category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (startDate) {
      queryText += ` AND transaction_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      queryText += ` AND transaction_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get spending by category for a date range
   */
  static async getSpendingByCategory(userId, startDate, endDate) {
    const result = await query(
      `SELECT
         c.category_id,
         c.name as category_name,
         c.color,
         SUM(t.amount) as total_amount,
         COUNT(t.transaction_id) as transaction_count
       FROM transactions t
       JOIN categories c ON t.category_id = c.category_id
       WHERE t.user_id = $1
         AND t.type = 'expense'
         AND t.transaction_date BETWEEN $2 AND $3
       GROUP BY c.category_id, c.name, c.color
       ORDER BY total_amount DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }

  /**
   * Get monthly spending trend
   */
  static async getMonthlyTrend(userId, months = 6) {
    const result = await query(
      `SELECT
         DATE_TRUNC('month', transaction_date) as month,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
         COUNT(*) as transaction_count
       FROM transactions
       WHERE user_id = $1
         AND transaction_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', transaction_date)
       ORDER BY month DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Transaction;
