const esmSellerRepository = require('../repositories/esmSellerRepository');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../utils/errors');

/**
 * Service for ESM Seller operations
 */
class ESMSellerService {
  /**
   * Register a new seller
   * @param {Object} sellerData - Seller registration data
   * @returns {Promise<Object>} Registered seller data
   */
  async registerSeller(sellerData) {
    // Validate service period
    const { serviceYears } = sellerData;
    if (serviceYears && serviceYears.from && serviceYears.to) {
      if (serviceYears.from > serviceYears.to) {
        throw new BadRequestError('Service start year must be before end year');
      }
      if (serviceYears.to > new Date().getFullYear()) {
        throw new BadRequestError('Service end year cannot be in the future');
      }
    }
    
    // Create the seller
    const seller = await esmSellerRepository.registerSeller(sellerData);
    
    return {
      seller,
      message: 'Registration successful. Your account is pending verification.'
    };
  }

  /**
   * Login a seller
   * @param {string} email - Seller email
   * @param {string} password - Seller password
   * @returns {Promise<Object>} Authentication result with token
   */
  async loginSeller(email, password) {
    // Authenticate the seller
    const seller = await esmSellerRepository.authenticateSeller(email, password);
    
    // Check if seller is verified and active
    if (!seller.isVerified) {
      return {
        seller,
        message: 'Your account is pending verification. You can update your profile, but you cannot list products until verification is complete.',
        token: this._generateToken(seller)
      };
    }
    
    if (seller.status !== 'active') {
      throw new BadRequestError(`Your account is ${seller.status}. Please contact support for assistance.`);
    }
    
    // Generate JWT token
    const token = this._generateToken(seller);
    
    return {
      seller,
      token,
      message: 'Login successful'
    };
  }

  /**
   * Get seller profile
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Object>} Seller profile
   */
  async getSellerProfile(sellerId) {
    return await esmSellerRepository.getSellerById(sellerId);
  }

  /**
   * Update seller profile
   * @param {string} sellerId - Seller ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated seller profile
   */
  async updateSellerProfile(sellerId, updateData) {
    return await esmSellerRepository.updateSellerProfile(sellerId, updateData);
  }

  /**
   * Change seller password
   * @param {string} sellerId - Seller ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(sellerId, currentPassword, newPassword) {
    // Validate new password
    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }
    
    // Same password check
    if (currentPassword === newPassword) {
      throw new BadRequestError('New password must be different from current password');
    }
    
    await esmSellerRepository.changePassword(sellerId, currentPassword, newPassword);
    
    return { message: 'Password changed successfully' };
  }

  /**
   * Get all sellers (for admin or public directory)
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {boolean} isPublic - Whether this is a public facing or admin request
   * @returns {Promise<Object>} Paginated sellers
   */
  async getAllSellers(filters = {}, page = 1, limit = 10, isPublic = false) {
    // For public directory, only show verified and active sellers
    if (isPublic) {
      filters.isVerified = true;
      filters.status = 'active';
    }
    
    return await esmSellerRepository.getAllSellers(filters, page, limit);
  }
  
  /**
   * Get count of sellers with optional filters
   * @param {Object} filters - Filters to apply
   * @returns {Promise<number>} Count of sellers
   */
  async getSellerCount(filters = {}) {
    return await esmSellerRepository.countSellers(filters);
  }
  
  /**
   * Update seller status
   * @param {string} sellerId - Seller ID
   * @param {string} status - New status ('active', 'suspended', 'rejected')
   * @returns {Promise<Object>} Updated seller
   */
  async updateSellerStatus(sellerId, status) {
    // Validate status
    if (!['active', 'suspended', 'pending', 'rejected'].includes(status)) {
      throw new BadRequestError('Invalid status value');
    }
    
    const seller = await esmSellerRepository.updateSellerProfile(sellerId, { status });
    
    return {
      seller,
      message: `Seller status updated to ${status}`
    };
  }

  /**
   * Admin function to verify a seller
   * @param {string} sellerId - Seller ID
   * @param {boolean} isVerified - Verification status
   * @param {string} notes - Admin notes
   * @returns {Promise<Object>} Updated seller and result message
   */
  async verifySeller(sellerId, isVerified, notes) {
    // Determine status based on verification
    const status = isVerified ? 'active' : 'pending';
    
    const seller = await esmSellerRepository.verifySeller(sellerId, isVerified, notes, status);
    
    return {
      seller,
      message: isVerified 
        ? 'Seller verified successfully and is now active' 
        : 'Seller verification declined'
    };
  }

  /**
   * Generate JWT token for a seller
   * @param {Object} seller - Seller data
   * @returns {string} JWT token
   * @private
   */
  _generateToken(seller) {
    const payload = {
      id: seller._id,
      email: seller.email,
      fullName: seller.fullName,
      role: 'seller',
      isVerified: seller.isVerified
    };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }
}

module.exports = new ESMSellerService();