const Order = require('./mongoose/orderModel');

/**
 * Order Model Interface
 * Abstraction for the Order model
 */
class OrderModel {
  /**
   * Create a new order
   * @param {Object} orderData Order data
   * @returns {Promise<Object>} Created order
   */
  async create(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} id Order ID
   * @returns {Promise<Object>} Order object
   */
  async getById(id) {
    try {
      return await Order.findById(id)
        .populate('buyer', 'firstName lastName email phone')
        .populate('seller', 'businessName contactEmail contactPhone')
        .populate('items.product', 'name images price')
        .populate('items.service', 'name images price');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order by order number
   * @param {string} orderNumber Order number
   * @returns {Promise<Object>} Order object
   */
  async getByOrderNumber(orderNumber) {
    try {
      return await Order.findOne({ orderNumber })
        .populate('buyer', 'firstName lastName email phone')
        .populate('seller', 'businessName contactEmail contactPhone')
        .populate('items.product', 'name images price')
        .populate('items.service', 'name images price');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get orders by buyer ID
   * @param {string} buyerId Buyer ID
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of order objects
   */
  async getByBuyer(buyerId, options = {}) {
    try {
      const query = Order.find({ buyer: buyerId })
        .populate('seller', 'businessName')
        .populate('items.product', 'name images')
        .populate('items.service', 'name images');

      // Apply pagination
      if (options.limit) {
        query.limit(Number(options.limit));
      }
      if (options.skip) {
        query.skip(Number(options.skip));
      }
      
      // Apply sorting
      const sortField = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
      query.sort({ [sortField]: sortOrder });
      
      // Apply status filter
      if (options.status) {
        query.where('status').equals(options.status);
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get orders by seller ID
   * @param {string} sellerId Seller ID
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of order objects
   */
  async getBySeller(sellerId, options = {}) {
    try {
      const query = Order.find({ seller: sellerId })
        .populate('buyer', 'firstName lastName')
        .populate('items.product', 'name images')
        .populate('items.service', 'name images');

      // Apply pagination
      if (options.limit) {
        query.limit(Number(options.limit));
      }
      if (options.skip) {
        query.skip(Number(options.skip));
      }
      
      // Apply sorting
      const sortField = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
      query.sort({ [sortField]: sortOrder });
      
      // Apply status filter
      if (options.status) {
        query.where('status').equals(options.status);
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update order
   * @param {string} id Order ID
   * @param {Object} updateData Data to update
   * @returns {Promise<Object>} Updated order
   */
  async update(id, updateData) {
    try {
      return await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete order
   * @param {string} id Order ID
   * @returns {Promise<Object>} Deleted order
   */
  async delete(id) {
    try {
      return await Order.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count orders
   * @param {Object} filter Filter criteria
   * @returns {Promise<number>} Count of orders
   */
  async count(filter = {}) {
    try {
      return await Order.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search orders
   * @param {Object} criteria Search criteria
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of matching orders
   */
  async search(criteria, options = {}) {
    try {
      const query = Order.find(criteria);
      
      // Apply pagination
      if (options.limit) {
        query.limit(Number(options.limit));
      }
      if (options.skip) {
        query.skip(Number(options.skip));
      }
      
      // Apply sorting
      const sortField = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
      query.sort({ [sortField]: sortOrder });
      
      // Apply population
      if (options.populate) {
        options.populate.forEach(field => {
          query.populate(field);
        });
      } else {
        // Default population
        query.populate('buyer', 'firstName lastName email')
          .populate('seller', 'businessName')
          .populate('items.product', 'name images')
          .populate('items.service', 'name images');
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the underlying Mongoose model
   * @returns {Object} Mongoose model
   */
  getModel() {
    return Order;
  }
}

module.exports = new OrderModel();