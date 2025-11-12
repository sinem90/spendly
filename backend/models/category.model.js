const { query } = require('../config/database');

/**
 * Category Model
 * Handles all database operations for the categories table
 */
class Category {
  /**
   * Find category by ID
   */
  static async findById(categoryId, userId) {
    const result = await query(
      'SELECT * FROM categories WHERE category_id = $1 AND user_id = $2',
      [categoryId, userId]
    );
    return result.rows[0];
  }

  /**
   * Get all categories for a user
   */
  static async findByUser(userId, type = null) {
    let queryText = 'SELECT * FROM categories WHERE user_id = $1';
    const params = [userId];

    if (type) {
      queryText += ' AND type = $2';
      params.push(type);
    }

    queryText += ' ORDER BY name ASC';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Create new category
   */
  static async create({ userId, name, type, color }) {
    const result = await query(
      `INSERT INTO categories (user_id, name, type, color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, name, type, color || '#2563eb']
    );
    return result.rows[0];
  }

  /**
   * Update category
   */
  static async update(categoryId, userId, { name, type, color }) {
    const result = await query(
      `UPDATE categories
       SET name = COALESCE($3, name),
           type = COALESCE($4, type),
           color = COALESCE($5, color)
       WHERE category_id = $1 AND user_id = $2
       RETURNING *`,
      [categoryId, userId, name, type, color]
    );
    return result.rows[0];
  }

  /**
   * Delete category
   * Note: This will fail if there are transactions referencing this category (RESTRICT constraint)
   */
  static async delete(categoryId, userId) {
    const result = await query(
      'DELETE FROM categories WHERE category_id = $1 AND user_id = $2 RETURNING category_id',
      [categoryId, userId]
    );
    return result.rows[0];
  }

  /**
   * Check if category has transactions
   */
  static async hasTransactions(categoryId, userId) {
    const result = await query(
      `SELECT EXISTS(
         SELECT 1 FROM transactions
         WHERE category_id = $1 AND user_id = $2
       ) as has_transactions`,
      [categoryId, userId]
    );
    return result.rows[0].has_transactions;
  }

  /**
   * Get category with transaction count
   */
  static async findWithStats(categoryId, userId) {
    const result = await query(
      `SELECT
         c.*,
         COUNT(t.transaction_id) as transaction_count,
         COALESCE(SUM(t.amount), 0) as total_amount
       FROM categories c
       LEFT JOIN transactions t ON c.category_id = t.category_id
       WHERE c.category_id = $1 AND c.user_id = $2
       GROUP BY c.category_id`,
      [categoryId, userId]
    );
    return result.rows[0];
  }
}

module.exports = Category;
