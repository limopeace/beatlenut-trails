const esmProductRepository = require('../repositories/esmProductRepository');
const esmSellerRepository = require('../repositories/esmSellerRepository');
const { BadRequestError, NotFoundError } = require('../utils/errors');

/**
 * Service for ESM Product operations
 */
class ESMProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Object>} Created product data
   */
  async createProduct(productData, sellerId) {
    // Validate seller exists and is verified
    const seller = await esmSellerRepository.getSellerById(sellerId);
    
    if (!seller.isVerified) {
      throw new BadRequestError('Your account must be verified before you can create products.');
    }
    
    if (seller.status !== 'active') {
      throw new BadRequestError(`Cannot create product. Your account status is: ${seller.status}`);
    }
    
    // Set the seller for this product
    productData.seller = sellerId;
    
    // Create the product
    const product = await esmProductRepository.createProduct(productData);
    
    return {
      product,
      message: 'Product created successfully'
    };
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    return await esmProductRepository.getProductById(productId);
  }

  /**
   * Update a product
   * @param {string} productId - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, sellerId, updateData) {
    return await esmProductRepository.updateProduct(productId, sellerId, updateData);
  }

  /**
   * Delete a product
   * @param {string} productId - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @returns {Promise<Object>} Success message
   */
  async deleteProduct(productId, sellerId) {
    await esmProductRepository.deleteProduct(productId, sellerId);
    
    return {
      message: 'Product deleted successfully'
    };
  }

  /**
   * Get all products with filtering and pagination
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {boolean} isPublic - Whether this is a public request
   * @returns {Promise<Object>} Paginated products
   */
  async getAllProducts(filters = {}, page = 1, limit = 10, isPublic = true) {
    // For public listings, only show active and approved products
    if (isPublic) {
      filters.publicOnly = true;
    }
    
    return await esmProductRepository.getAllProducts(filters, page, limit);
  }

  /**
   * Get featured products
   * @param {string} category - Optional category filter
   * @param {number} limit - Number of products to return
   * @returns {Promise<Array>} Featured products
   */
  async getFeaturedProducts(category, limit = 8) {
    return await esmProductRepository.getFeaturedProducts(category, limit);
  }

  /**
   * Get seller's products
   * @param {string} sellerId - Seller ID
   * @param {Object} filters - Additional filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated seller products
   */
  async getSellerProducts(sellerId, filters = {}, page = 1, limit = 10) {
    return await esmProductRepository.getProductsBySeller(sellerId, filters, page, limit);
  }

  /**
   * Admin function to approve a product
   * @param {string} productId - Product ID
   * @param {boolean} isApproved - Approval status
   * @param {string} notes - Admin notes
   * @returns {Promise<Object>} Updated product with message
   */
  async approveProduct(productId, isApproved, notes) {
    const product = await esmProductRepository.approveProduct(productId, isApproved, notes);
    
    return {
      product,
      message: isApproved 
        ? 'Product approved successfully' 
        : 'Product approval declined'
    };
  }
  
  /**
   * Get count of products with optional filters
   * @param {Object} filters - Filters to apply
   * @returns {Promise<number>} Count of products
   */
  async getProductCount(filters = {}) {
    // For public listings, only count active and approved products
    if (!filters.includeAll) {
      filters.publicOnly = true;
    }
    
    delete filters.includeAll;
    
    return await esmProductRepository.countProducts(filters);
  }
  
  /**
   * Update product status (admin function)
   * @param {string} productId - Product ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Updated product
   */
  async updateProductStatus(productId, status, notes) {
    // Validate status
    if (!['pending', 'active', 'rejected', 'inactive'].includes(status)) {
      throw new BadRequestError('Invalid status value');
    }
    
    const updateData = { 
      status,
      adminNotes: notes
    };
    
    const product = await esmProductRepository.updateProduct(productId, null, updateData, true);
    
    return {
      product,
      message: `Product status updated to ${status}`
    };
  }
}

module.exports = new ESMProductService();