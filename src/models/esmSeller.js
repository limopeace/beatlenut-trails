const ESMSeller = require('./mongoose/esmSellerModel');
const { BadRequestError, NotFoundError } = require('../utils/errors');

/**
 * ESM Seller model for handling operations related to Ex-Servicemen sellers
 */
class ESMSellerModel {
  /**
   * Create a new ESM seller
   * @param {Object} sellerData - Data for creating the seller
   * @returns {Promise<Object>} Newly created seller
   */
  async create(sellerData) {
    try {
      const seller = new ESMSeller(sellerData);
      await seller.save();
      
      // Remove sensitive data before returning
      const result = seller.toObject();
      delete result.password;
      delete result.verificationDocument;
      
      return result;
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key errors (email or service number)
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
      }
      throw error;
    }
  }

  /**
   * Find a seller by ID
   * @param {string} id - Seller ID
   * @returns {Promise<Object>} Seller data
   */
  async findById(id) {
    const seller = await ESMSeller.findById(id);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    // Remove sensitive data before returning
    const result = seller.toObject();
    delete result.password;
    delete result.verificationDocument;
    
    return result;
  }

  /**
   * Find a seller by email
   * @param {string} email - Seller email
   * @returns {Promise<Object>} Seller data including password for authentication
   */
  async findByEmail(email) {
    const seller = await ESMSeller.findOne({ email });
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    return seller;
  }

  /**
   * Update a seller
   * @param {string} id - Seller ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated seller data
   */
  async update(id, updateData) {
    // Prevent updating sensitive fields directly
    const protectedFields = ['password', 'email', 'serviceNumber', 'isVerified', 'status'];
    for (const field of protectedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }
    
    const seller = await ESMSeller.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    // Remove sensitive data before returning
    const result = seller.toObject();
    delete result.password;
    delete result.verificationDocument;
    
    return result;
  }

  /**
   * Change seller password
   * @param {string} id - Seller ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success indicator
   */
  async changePassword(id, currentPassword, newPassword) {
    const seller = await ESMSeller.findById(id);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    const isMatch = await seller.checkPassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }
    
    seller.password = newPassword;
    await seller.save();
    
    return true;
  }

  /**
   * Update seller verification status
   * @param {string} id - Seller ID
   * @param {boolean} isVerified - Verification status
   * @param {string} notes - Admin notes about verification
   * @param {string} status - Account status
   * @returns {Promise<Object>} Updated seller data
   */
  async updateVerification(id, isVerified, notes, status) {
    const seller = await ESMSeller.findByIdAndUpdate(
      id,
      { 
        isVerified, 
        verificationNotes: notes,
        status: status || (isVerified ? 'active' : 'pending')
      },
      { new: true }
    );
    
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    
    // Remove sensitive data before returning
    const result = seller.toObject();
    delete result.password;
    delete result.verificationDocument;
    
    return result;
  }

  /**
   * Get all sellers with pagination and filtering
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated sellers with metadata
   */
  async getAll(filters = {}, page = 1, limit = 10) {
    const query = {};
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
    if (filters.serviceBranch) query.serviceBranch = filters.serviceBranch;
    
    // Text search
    if (filters.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { businessName: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await ESMSeller.countDocuments(query);
    
    // Get sellers with pagination
    const sellers = await ESMSeller.find(query)
      .select('-password -verificationDocument')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      sellers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ESMSellerModel();