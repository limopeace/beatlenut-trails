const orderService = require('../services/orderService');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * Order Controller
 * Handles order-related API requests
 */
class OrderController {
  /**
   * Create a new order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createOrder(req, res, next) {
    try {
      const orderData = req.body;
      const userId = req.user.id;
      
      const order = await orderService.createOrder(orderData, userId);
      
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrderById(req, res, next) {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const order = await orderService.getOrderById(orderId, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by order number
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrderByNumber(req, res, next) {
    try {
      const orderNumber = req.params.orderNumber;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const order = await orderService.getOrderByNumber(orderNumber, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get orders for current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        status: req.query.status
      };
      
      const orders = await orderService.getOrdersByBuyer(userId, options, userId);
      
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get orders for a specific buyer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrdersByBuyer(req, res, next) {
    try {
      const buyerId = req.params.buyerId;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        status: req.query.status
      };
      
      const orders = await orderService.getOrdersByBuyer(buyerId, options, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get orders for seller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrdersBySeller(req, res, next) {
    try {
      const sellerId = req.params.sellerId;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        status: req.query.status
      };
      
      const orders = await orderService.getOrdersBySeller(sellerId, options, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateOrderStatus(req, res, next) {
    try {
      const orderId = req.params.id;
      const { status, note } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      if (!status) {
        throw new ValidationError('Status is required');
      }
      
      const order = await orderService.updateOrderStatus(orderId, status, note, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payment information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updatePayment(req, res, next) {
    try {
      const orderId = req.params.id;
      const paymentData = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const order = await orderService.updatePayment(orderId, paymentData, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update tracking information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateTracking(req, res, next) {
    try {
      const orderId = req.params.id;
      const { carrier, trackingNumber, estimatedDelivery } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      if (!carrier || !trackingNumber) {
        throw new ValidationError('Carrier and tracking number are required');
      }
      
      // Check authorization (only seller or admin can update tracking)
      const order = await orderService.getOrderById(orderId, userId, isAdmin);
      
      if (!isAdmin && order.seller.toString() !== userId) {
        throw new AuthorizationError('Not authorized to update tracking');
      }
      
      const trackingData = {
        carrier,
        trackingNumber,
        estimatedDelivery: estimatedDelivery || null
      };
      
      const updatedOrder = await orderService.updateTracking(orderId, trackingData, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel an order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async cancelOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const { reason } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const order = await orderService.cancelOrder(orderId, reason, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process refund for an order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async refundOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const { amount, reason } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      if (!reason) {
        throw new ValidationError('Refund reason is required');
      }
      
      const order = await orderService.refundOrder(orderId, amount, reason, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrderStatistics(req, res, next) {
    try {
      const sellerId = req.query.sellerId;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const stats = await orderService.getOrderStatistics(sellerId, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async searchOrders(req, res, next) {
    try {
      const searchParams = {
        orderNumber: req.query.orderNumber,
        buyer: req.query.buyer,
        seller: req.query.seller,
        status: req.query.status,
        paymentStatus: req.query.paymentStatus,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount
      };
      
      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };
      
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      const result = await orderService.searchOrders(searchParams, options, userId, isAdmin);
      
      res.status(200).json({
        success: true,
        data: result.orders,
        count: result.totalCount,
        page: Math.floor(options.skip / options.limit) + 1,
        totalPages: Math.ceil(result.totalCount / options.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent orders for admin dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getRecentOrders(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const orders = await orderService.getRecentOrders(limit);
      
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();