const { query } = require('../config/database');

/**
 * User Model
 * Handles all database operations for the users table
 */
class User {
  /**
   * Find user by ID
   */
  static async findById(userId) {
    const result = await query(
      'SELECT user_id, email, first_name, last_name, created_at, updated_at FROM users WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  /**
   * Create new user
   */
  static async create({ email, passwordHash, firstName, lastName }) {
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, email, first_name, last_name, created_at`,
      [email, passwordHash, firstName, lastName]
    );
    return result.rows[0];
  }

  /**
   * Update user profile
   */
  static async update(userId, { firstName, lastName, email }) {
    const result = await query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           email = COALESCE($4, email),
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, email, first_name, last_name, updated_at`,
      [userId, firstName, lastName, email]
    );
    return result.rows[0];
  }

  /**
   * Update user password
   */
  static async updatePassword(userId, newPasswordHash) {
    const result = await query(
      `UPDATE users
       SET password_hash = $2, updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id`,
      [userId, newPasswordHash]
    );
    return result.rows[0];
  }

  /**
   * Delete user and all associated data (CASCADE)
   */
  static async delete(userId) {
    const result = await query(
      'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
      [userId]
    );
    return result.rows[0];
  }

  /**
   * Check if email exists
   */
  static async emailExists(email) {
    const result = await query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists',
      [email]
    );
    return result.rows[0].exists;
  }
}

module.exports = User;
