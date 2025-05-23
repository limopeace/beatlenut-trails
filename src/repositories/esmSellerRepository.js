const ESMSeller = require('../models/mongoose/esmSellerModel');
const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const mongoose = require('mongoose');

/**
 * Repository for ESM Seller operations
 */
class ESMSellerRepository {
  /**
   * Register a new seller
   * @param {Object} sellerData - Seller registration data
   * @returns {Promise<Object>} Registered seller data
   */
  async registerSeller(sellerData) {
    try {
      // Check if email is already in use
      const existingUser = await ESMSeller.findOne({ email: sellerData.email });
      if (existingUser) {
        throw new BadRequestError('Email is already in use');
      }
      
      // Create new seller
      const seller = new ESMSeller(sellerData);
      await seller.save();
      
      // Remove sensitive data before returning
      seller.password = undefined;
      
      return seller;
    } catch (error) {
      // Re-throw mongoose validation errors as BadRequestError
      if (error.name === 'ValidationError') {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  /**
   * Authenticate a seller
   * @param {string} email - Seller email
   * @param {string} password - Seller password
   * @returns {Promise<Object>} Authenticated seller
   */
  async authenticateSeller(email, password) {
    // Find seller by email
    const seller = await ESMSeller.findOne({ email });
    if (!seller) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = await seller.checkPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // Remove sensitive data before returning
    seller.password = undefined;
    
    return seller;
  }

  /**
   * Get seller by ID
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Object>} Seller data
   */
  async getSellerById(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      throw new BadRequestError('Invalid seller ID format');
    }
    
    const seller = await ESMSeller.findById(sellerId).select('-password');
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    return seller;
  }

  /**
   * Update seller profile
   * @param {string} sellerId - Seller ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated seller profile
   */
  async updateSellerProfile(sellerId, updateData) {
    // Check if seller exists
    await this.getSellerById(sellerId);
    
    // Prevent updating sensitive fields directly
    const protectedFields = ['password', 'isVerified', 'verificationDocument'];
    protectedFields.forEach(field => {
      if (field in updateData && field !== 'verificationDocument') {
        delete updateData[field];
      }
    });
    
    // Update seller
    const updatedSeller = await ESMSeller.findByIdAndUpdate(
      sellerId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    return updatedSeller;
  }

  /**
   * Change seller password
   * @param {string} sellerId - Seller ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success indicator
   */
  async changePassword(sellerId, currentPassword, newPassword) {
    // Get seller with password
    const seller = await ESMSeller.findById(sellerId);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    // Verify current password
    const isCurrentPasswordValid = await seller.checkPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }
    
    // Update password
    seller.password = newPassword;
    await seller.save();
    
    return true;
  }

  /**
   * Get all sellers with filters and pagination
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated sellers
   */
  async getAllSellers(filters = {}, page = 1, limit = 10) {
    const query = this._buildQuery(filters);
    const skip = (page - 1) * limit;
    
    const [sellers, total] = await Promise.all([
      ESMSeller.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ESMSeller.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      sellers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Count sellers with filters
   * @param {Object} filters - Filters to apply
   * @returns {Promise<number>} Count of sellers
   */
  async countSellers(filters = {}) {
    const query = this._buildQuery(filters);
    return await ESMSeller.countDocuments(query);
  }

  /**
   * Verify a seller
   * @param {string} sellerId - Seller ID
   * @param {boolean} isVerified - Verification status
   * @param {string} notes - Verification notes
   * @param {string} status - Seller status
   * @returns {Promise<Object>} Updated seller
   */
  async verifySeller(sellerId, isVerified, notes, status) {
    const updateData = {
      isVerified,
      verificationNotes: notes
    };
    
    if (status) {
      updateData.status = status;
    }
    
    // Update seller
    const updatedSeller = await ESMSeller.findByIdAndUpdate(
      sellerId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedSeller) {
      throw new NotFoundError('Seller not found');
    }
    
    return updatedSeller;
  }

  /**
   * Build MongoDB query from filters
   * @param {Object} filters - Filter criteria
   * @returns {Object} MongoDB query object
   * @private
   */
  _buildQuery(filters) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.serviceBranch) {
      query.serviceBranch = filters.serviceBranch;
    }
    
    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified;
    }
    
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { businessName: searchRegex },
        { location: searchRegex },
        { description: searchRegex }
      ];
    }
    
    return query;
  }
}

module.exports = new ESMSellerRepository();