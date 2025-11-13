const User = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;

    // Users can only access their own data
    if (id !== requestingUserId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own user data',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this ID',
      });
    }

    res.status(200).json({
      userId: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;
    const { firstName, lastName, email, currentPassword, newPassword } = req.body;

    // Users can only update their own data
    if (id !== requestingUserId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own user data',
      });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: 'Current password required',
          message: 'You must provide your current password to set a new one',
        });
      }

      const user = await User.findById(id);
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid password',
          message: 'Current password is incorrect',
        });
      }

      // Hash and update new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(id, newPasswordHash);
    }

    // Update profile fields
    const updatedUser = await User.update(id, {
      firstName,
      lastName,
      email,
    });

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this ID',
      });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        userId: updatedUser.user_id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;

    // Users can only delete their own account
    if (id !== requestingUserId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    const deletedUser = await User.delete(id);
    if (!deletedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this ID',
      });
    }

    res.status(200).json({
      message: 'User account deleted successfully',
      userId: deletedUser.user_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
};
