const ESMProduct = require('./mongoose/esmProductModel');
const { BadRequestError, NotFoundError } = require('../utils/errors');

/**
 * ESM Product model for handling operations related to products and services
 * in the Ex-Servicemen marketplace
 */
class ESMProductModel {
  /**
   * Create a new product
   * @param {Object} productData - Data for creating the product
   * @returns {Promise<Object>} Newly created product
   */
  async create(productData) {
    try {
      const product = new ESMProduct(productData);
      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async findById(id) {
    const product = await ESMProduct.findById(id)
      .populate('seller', 'fullName businessName location ratings');
      
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    return product;
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product data
   */
  async update(id, sellerId, updateData) {
    // First check if product exists and belongs to the seller
    const product = await ESMProduct.findOne({ _id: id, seller: sellerId });
    
    if (!product) {
      throw new NotFoundError('Product not found or you do not have permission to update it');
    }
    
    // Prevent updating protected fields
    const protectedFields = ['seller', 'createdAt', 'ratings', 'views'];
    for (const field of protectedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }
    
    // If status is being changed to 'active', ensure it's approved
    if (updateData.status === 'active' && !product.isApproved) {
      updateData.status = 'draft';
    }
    
    const updatedProduct = await ESMProduct.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('seller', 'fullName businessName location ratings');
    
    return updatedProduct;
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @param {string} sellerId - Seller ID (for verification)
   * @returns {Promise<boolean>} Success indicator
   */
  async delete(id, sellerId) {
    const result = await ESMProduct.deleteOne({ _id: id, seller: sellerId });
    
    if (result.deletedCount === 0) {
      throw new NotFoundError('Product not found or you do not have permission to delete it');
    }
    
    return true;
  }

  /**
   * Update product approval status (admin function)
   * @param {string} id - Product ID
   * @param {boolean} isApproved - Approval status
   * @param {string} notes - Admin notes
   * @returns {Promise<Object>} Updated product data
   */
  async updateApproval(id, isApproved, notes) {
    const product = await ESMProduct.findByIdAndUpdate(
      id,
      { 
        isApproved, 
        adminNotes: notes,
        status: isApproved ? 'active' : 'draft'
      },
      { new: true }
    ).populate('seller', 'fullName businessName location ratings');
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    return product;
  }

  /**
   * Increment product view count
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  async incrementViews(id) {
    await ESMProduct.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  /**
   * Get all products with pagination and filtering
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated products with metadata
   */
  async getAll(filters = {}, page = 1, limit = 10) {
    const query = {};
    
    // Apply filters
    if (filters.category) query.category = filters.category;
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.seller) query.seller = filters.seller;
    if (filters.minPrice) query['price.amount'] = { $gte: filters.minPrice };
    if (filters.maxPrice) {
      if (query['price.amount']) {
        query['price.amount'].$lte = filters.maxPrice;
      } else {
        query['price.amount'] = { $lte: filters.maxPrice };
      }
    }
    
    // For services, handle location filtering
    if (filters.location && filters.type === 'service') {
      query['availability.locations'] = { $in: [filters.location] };
    }
    
    // Handle search filtering
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    // Only show active and approved products for public listings
    if (filters.publicOnly) {
      query.status = 'active';
      query.isApproved = true;
    }
    
    // Get total count for pagination
    const total = await ESMProduct.countDocuments(query);
    
    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default sort by newest
    
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          sortOptions = { 'price.amount': 1 };
          break;
        case 'price-desc':
          sortOptions = { 'price.amount': -1 };
          break;
        case 'rating':
          sortOptions = { 'ratings.average': -1 };
          break;
        case 'popularity':
          sortOptions = { views: -1 };
          break;
      }
    }
    
    // Add relevance sorting for text searches
    if (filters.search) {
      sortOptions = { score: { $meta: 'textScore' } };
    }
    
    // Get products with pagination
    const products = await ESMProduct.find(query)
      .populate('seller', 'fullName businessName location ratings')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get featured products
   * @param {string} category - Optional category filter
   * @param {number} limit - Number of products to return
   * @returns {Promise<Array>} Featured products
   */
  async getFeatured(category, limit = 8) {
    const query = {
      status: 'active',
      isApproved: true
    };
    
    if (category) {
      query.category = category;
    }
    
    // Get products with highest ratings and views
    const products = await ESMProduct.find(query)
      .populate('seller', 'fullName businessName location ratings')
      .sort({ 'ratings.average': -1, views: -1, createdAt: -1 })
      .limit(limit);
    
    return products;
  }

  /**
   * Get products by seller
   * @param {string} sellerId - Seller ID
   * @param {Object} filters - Additional filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated seller products with metadata
   */
  async getBySeller(sellerId, filters = {}, page = 1, limit = 10) {
    const query = { seller: sellerId };
    
    // Apply additional filters
    if (filters.category) query.category = filters.category;
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    
    // Get total count for pagination
    const total = await ESMProduct.countDocuments(query);
    
    // Get products with pagination
    const products = await ESMProduct.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ESMProductModel();