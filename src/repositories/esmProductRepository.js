const esmProductModel = require('../models/esmProduct');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Repository for ESM Product operations
 */
class ESMProductRepository {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      return await esmProductModel.create(productData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(id) {
    try {
      const product = await esmProductModel.findById(id);
      // Increment the view count
      await esmProductModel.incrementViews(id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, sellerId, updateData) {
    try {
      return await esmProductModel.update(id, sellerId, updateData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteProduct(id, sellerId) {
    try {
      return await esmProductModel.delete(id, sellerId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products with pagination and filtering
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated products with metadata
   */
  async getAllProducts(filters, page, limit) {
    try {
      return await esmProductModel.getAll(filters, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured products
   * @param {string} category - Optional category filter
   * @param {number} limit - Number of products to return
   * @returns {Promise<Array>} Featured products
   */
  async getFeaturedProducts(category, limit) {
    try {
      return await esmProductModel.getFeatured(category, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get products by seller
   * @param {string} sellerId - Seller ID
   * @param {Object} filters - Additional filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated seller products with metadata
   */
  async getProductsBySeller(sellerId, filters, page, limit) {
    try {
      return await esmProductModel.getBySeller(sellerId, filters, page, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Admin function to approve a product
   * @param {string} id - Product ID
   * @param {boolean} isApproved - Approval status
   * @param {string} notes - Admin notes
   * @returns {Promise<Object>} Updated product
   */
  async approveProduct(id, isApproved, notes) {
    try {
      return await esmProductModel.updateApproval(id, isApproved, notes);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Count products with filters
   * @param {Object} filters - Filters to apply
   * @returns {Promise<number>} Count of products
   */
  async countProducts(filters = {}) {
    try {
      return await esmProductModel.count(filters);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ESMProductRepository();