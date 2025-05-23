const Order = require('../models/mongoose/orderModel');
const { DatabaseError } = require('../utils/errors');

/**
 * Order Repository
 * Handles data access operations for orders
 */
class OrderRepository {
  /**
   * Create a new order
   * @param {Object} orderData Order data
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw new DatabaseError(`Error creating order: ${error.message}`, error);
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId Order ID
   * @returns {Promise<Object>} Order object
   */
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('buyer', 'firstName lastName email phone')
        .populate('seller', 'businessName contactEmail contactPhone')
        .populate('items.product', 'name images price')
        .populate('items.service', 'name images price');
      
      if (!order) {
        return null;
      }
      
      return order;
    } catch (error) {
      throw new DatabaseError(`Error fetching order: ${error.message}`, error);
    }
  }

  /**
   * Get order by order number
   * @param {string} orderNumber Order number
   * @returns {Promise<Object>} Order object
   */
  async getOrderByNumber(orderNumber) {
    try {
      const order = await Order.findOne({ orderNumber })
        .populate('buyer', 'firstName lastName email phone')
        .populate('seller', 'businessName contactEmail contactPhone')
        .populate('items.product', 'name images price')
        .populate('items.service', 'name images price');
      
      if (!order) {
        return null;
      }
      
      return order;
    } catch (error) {
      throw new DatabaseError(`Error fetching order: ${error.message}`, error);
    }
  }

  /**
   * Get orders by buyer ID
   * @param {string} buyerId Buyer ID
   * @param {Object} options Query options (limit, skip, sort)
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrdersByBuyer(buyerId, options = {}) {
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
      throw new DatabaseError(`Error fetching buyer orders: ${error.message}`, error);
    }
  }

  /**
   * Get orders by seller ID
   * @param {string} sellerId Seller ID
   * @param {Object} options Query options (limit, skip, sort)
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrdersBySeller(sellerId, options = {}) {
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
      throw new DatabaseError(`Error fetching seller orders: ${error.message}`, error);
    }
  }

  /**
   * Update order status
   * @param {string} orderId Order ID
   * @param {string} status New status
   * @param {string} note Optional note about status change
   * @param {string} updatedBy User ID who updated the status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status, note, updatedBy) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return null;
      }
      
      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`,
        updatedBy
      });
      
      // Special status handling
      if (status === 'completed') {
        order.isFulfilled = true;
        order.fulfillmentDate = new Date();
      }
      
      return await order.save();
    } catch (error) {
      throw new DatabaseError(`Error updating order status: ${error.message}`, error);
    }
  }

  /**
   * Update payment information
   * @param {string} orderId Order ID
   * @param {Object} paymentData Payment data
   * @returns {Promise<Object>} Updated order
   */
  async updatePayment(orderId, paymentData) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return null;
      }
      
      // Update payment fields
      Object.assign(order.payment, paymentData);
      
      // If payment is completed, update order status if it's pending
      if (paymentData.status === 'completed' && order.status === 'pending') {
        order.status = 'processing';
        order.statusHistory.push({
          status: 'processing',
          timestamp: new Date(),
          note: 'Payment completed'
        });
      }
      
      return await order.save();
    } catch (error) {
      throw new DatabaseError(`Error updating payment: ${error.message}`, error);
    }
  }

  /**
   * Update tracking information
   * @param {string} orderId Order ID
   * @param {Object} trackingData Tracking data
   * @returns {Promise<Object>} Updated order
   */
  async updateTracking(orderId, trackingData) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return null;
      }
      
      return await order.addTracking(
        trackingData.carrier,
        trackingData.trackingNumber,
        trackingData.estimatedDelivery
      );
    } catch (error) {
      throw new DatabaseError(`Error updating tracking: ${error.message}`, error);
    }
  }

  /**
   * Cancel an order
   * @param {string} orderId Order ID
   * @param {string} reason Cancellation reason
   * @returns {Promise<Object>} Updated order
   */
  async cancelOrder(orderId, reason) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return null;
      }
      
      return await order.cancel(reason);
    } catch (error) {
      throw new DatabaseError(`Error cancelling order: ${error.message}`, error);
    }
  }

  /**
   * Process refund for an order
   * @param {string} orderId Order ID
   * @param {number} amount Refund amount
   * @param {string} reason Refund reason
   * @returns {Promise<Object>} Updated order
   */
  async refundOrder(orderId, amount, reason) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return null;
      }
      
      return await order.refund(amount, reason);
    } catch (error) {
      throw new DatabaseError(`Error processing refund: ${error.message}`, error);
    }
  }

  /**
   * Get order statistics
   * @param {string} sellerId Optional seller ID to filter statistics
   * @returns {Promise<Object>} Order statistics
   */
  async getOrderStatistics(sellerId = null) {
    try {
      const match = sellerId ? { seller: sellerId } : {};
      
      const stats = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            processingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);
      
      // Monthly sales for the current year
      const currentYear = new Date().getFullYear();
      const monthlySales = await Order.aggregate([
        {
          $match: {
            ...match,
            createdAt: {
              $gte: new Date(`${currentYear}-01-01`),
              $lt: new Date(`${currentYear + 1}-01-01`)
            },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            revenue: { $sum: '$total' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      return {
        overall: stats.length ? stats[0] : {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          processingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0
        },
        monthlySales: monthlySales.map(month => ({
          month: month._id,
          revenue: month.revenue,
          count: month.count
        }))
      };
    } catch (error) {
      throw new DatabaseError(`Error generating order statistics: ${error.message}`, error);
    }
  }

  /**
   * Get recent orders for admin dashboard
   * @param {number} limit Number of orders to return
   * @returns {Promise<Array>} Array of recent orders
   */
  async getRecentOrders(limit = 10) {
    try {
      return await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('buyer', 'firstName lastName')
        .populate('seller', 'businessName')
        .populate('items.product', 'name')
        .populate('items.service', 'name')
        .select('orderNumber status total createdAt');
    } catch (error) {
      throw new DatabaseError(`Error fetching recent orders: ${error.message}`, error);
    }
  }

  /**
   * Search orders
   * @param {Object} searchParams Search parameters
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of matching orders
   */
  async searchOrders(searchParams, options = {}) {
    try {
      const query = {};
      
      // Add search parameters
      if (searchParams.orderNumber) {
        query.orderNumber = { $regex: searchParams.orderNumber, $options: 'i' };
      }
      
      if (searchParams.buyer) {
        query.buyer = searchParams.buyer;
      }
      
      if (searchParams.seller) {
        query.seller = searchParams.seller;
      }
      
      if (searchParams.status) {
        query.status = searchParams.status;
      }
      
      if (searchParams.paymentStatus) {
        query['payment.status'] = searchParams.paymentStatus;
      }
      
      if (searchParams.dateFrom || searchParams.dateTo) {
        query.createdAt = {};
        
        if (searchParams.dateFrom) {
          query.createdAt.$gte = new Date(searchParams.dateFrom);
        }
        
        if (searchParams.dateTo) {
          query.createdAt.$lte = new Date(searchParams.dateTo);
        }
      }
      
      if (searchParams.minAmount || searchParams.maxAmount) {
        query.total = {};
        
        if (searchParams.minAmount) {
          query.total.$gte = Number(searchParams.minAmount);
        }
        
        if (searchParams.maxAmount) {
          query.total.$lte = Number(searchParams.maxAmount);
        }
      }
      
      // Build query
      const dbQuery = Order.find(query)
        .populate('buyer', 'firstName lastName email')
        .populate('seller', 'businessName')
        .populate('items.product', 'name')
        .populate('items.service', 'name');
      
      // Apply pagination
      if (options.limit) {
        dbQuery.limit(Number(options.limit));
      }
      
      if (options.skip) {
        dbQuery.skip(Number(options.skip));
      }
      
      // Apply sorting
      const sortField = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
      dbQuery.sort({ [sortField]: sortOrder });
      
      // Execute query
      return await dbQuery.exec();
    } catch (error) {
      throw new DatabaseError(`Error searching orders: ${error.message}`, error);
    }
  }

  /**
   * Count orders matching search parameters
   * @param {Object} searchParams Search parameters
   * @returns {Promise<number>} Count of matching orders
   */
  async countOrders(searchParams = {}) {
    try {
      const query = {};
      
      // Add search parameters (same logic as searchOrders)
      if (searchParams.orderNumber) {
        query.orderNumber = { $regex: searchParams.orderNumber, $options: 'i' };
      }
      
      if (searchParams.buyer) {
        query.buyer = searchParams.buyer;
      }
      
      if (searchParams.seller) {
        query.seller = searchParams.seller;
      }
      
      if (searchParams.status) {
        query.status = searchParams.status;
      }
      
      if (searchParams.paymentStatus) {
        query['payment.status'] = searchParams.paymentStatus;
      }
      
      if (searchParams.dateFrom || searchParams.dateTo) {
        query.createdAt = {};
        
        if (searchParams.dateFrom) {
          query.createdAt.$gte = new Date(searchParams.dateFrom);
        }
        
        if (searchParams.dateTo) {
          query.createdAt.$lte = new Date(searchParams.dateTo);
        }
      }
      
      if (searchParams.minAmount || searchParams.maxAmount) {
        query.total = {};
        
        if (searchParams.minAmount) {
          query.total.$gte = Number(searchParams.minAmount);
        }
        
        if (searchParams.maxAmount) {
          query.total.$lte = Number(searchParams.maxAmount);
        }
      }
      
      return await Order.countDocuments(query);
    } catch (error) {
      throw new DatabaseError(`Error counting orders: ${error.message}`, error);
    }
  }
}

module.exports = new OrderRepository();