/**
 * User repository for database operations
 */
const UserModel = require('../models/mongoose/userModel');
const { NotFoundError } = require('../utils/errors');

class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    return await UserModel.create(userData);
  }

  /**
   * Find user by ID
   * @param {String} id - User ID
   * @returns {Promise<Object|null>} User or null if not found
   */
  async findById(id) {
    const user = await UserModel.findById(id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Promise<Object|null>} User or null if not found
   */
  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  /**
   * Find user by email with password (for authentication)
   * @param {String} email - User email
   * @returns {Promise<Object|null>} User with password field or null if not found
   */
  async findByEmailWithPassword(email) {
    return await UserModel.findOne({ email }).select('+password');
  }

  /**
   * Update user
   * @param {String} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async update(id, updateData) {
    const user = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Delete user (soft delete by setting active to false)
   * @param {String} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async delete(id) {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }
}

module.exports = UserRepository;