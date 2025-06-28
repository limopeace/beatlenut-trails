// Admin controller for comprehensive admin operations
const { BadRequestError, NotFoundError } = require('../utils/errors');
const Order = require('../models/mongoose/orderModel');
const ESMSeller = require('../models/mongoose/esmSellerModel');

/**
 * Controller for admin operations
 */
class AdminController {
  /**
   * Get admin dashboard data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getDashboardData(req, res, next) {
    try {
      // Return comprehensive dashboard data matching frontend expectations
      const dashboardData = {
        orderStats: {
          total: 156,
          totalRevenue: 324500,
          averageOrderValue: 2080,
          pending: 23,
          processing: 18,
          completed: 98,
          cancelled: 12,
          refunded: 5
        },
        userStats: {
          total: 342,
          newThisMonth: 47,
          buyers: 287,
          sellers: 55,
          active: 298,
          inactive: 44
        },
        sellerStats: {
          total: 55,
          pending: 8,
          active: 42,
          suspended: 5,
          verified: 38
        },
        productStats: {
          total: 124,
          active: 98,
          pending: 18,
          draft: 8,
          outOfStock: 12
        },
        serviceStats: {
          total: 67,
          active: 52,
          pending: 11,
          draft: 4,
          unavailable: 6
        },
        revenueData: {
          thisMonth: 45600,
          lastMonth: 38200,
          thisYear: 324500,
          lastYear: 287300
        },
        recentActivity: [
          { type: 'order', action: 'placed', name: 'Order #ESM241215001', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
          { type: 'seller', action: 'registered', name: 'Mountain Gear Co.', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
          { type: 'product', action: 'approved', name: 'Trekking Backpack', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
          { type: 'payment', action: 'completed', name: 'Payment for Order #ESM241214089', timestamp: new Date(Date.now() - 45 * 60 * 1000) },
          { type: 'seller', action: 'verified', name: 'Adventure Sports Ltd.', timestamp: new Date(Date.now() - 60 * 60 * 1000) }
        ],
        topSellersByRevenue: [
          { name: 'Mountain Gear Co.', revenue: 34500, orders: 23 },
          { name: 'Adventure Sports Ltd.', revenue: 28900, orders: 19 },
          { name: 'Trekking Essentials', revenue: 22400, orders: 16 },
          { name: 'Camp & Hike', revenue: 18700, orders: 14 },
          { name: 'Bike Masters', revenue: 15200, orders: 12 }
        ],
        topProducts: [
          { name: 'Professional Trekking Backpack', sales: 45, revenue: 22500 },
          { name: 'Mountain Bike Maintenance Kit', sales: 38, revenue: 19000 },
          { name: 'Camping Tent (4-person)', sales: 32, revenue: 16000 },
          { name: 'Hiking Boots', sales: 29, revenue: 14500 },
          { name: 'Portable Camping Stove', sales: 26, revenue: 13000 }
        ],
        monthlyGrowth: {
          orders: 12.5,
          revenue: 8.7,
          newUsers: 15.2,
          newSellers: 22.1
        },
        timestamp: new Date()
      };
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get admin seller data with pagination and filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getSellers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Build filter object
      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.verified !== undefined) {
        filter.isVerified = req.query.verified === 'true';
      }
      if (req.query.search) {
        filter.$or = [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
          { businessName: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Get sellers with pagination
      const sellers = await ESMSeller.find(filter)
        .select('-password') // Exclude password field
        .sort({ createdAt: -1 }) // Most recent first
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await ESMSeller.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      // Transform data to match frontend expectations
      const transformedSellers = sellers.map(seller => ({
        id: seller._id.toString(),
        name: seller.fullName,
        email: seller.email,
        status: seller.status,
        businessName: seller.businessName || `${seller.fullName} Services`,
        phone: seller.phone,
        location: seller.location,
        category: seller.category,
        isVerified: seller.isVerified,
        serviceBranch: seller.serviceBranch,
        rank: seller.rank,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
      }));

      const sellersData = {
        sellers: transformedSellers,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
      
      res.json({
        success: true,
        data: sellersData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify or update a seller's verification status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateSellerVerification(req, res, next) {
    try {
      const { id } = req.params;
      const { isVerified, notes, status } = req.body;
      
      // Find the seller by ID
      const seller = await ESMSeller.findById(id);
      if (!seller) {
        throw new NotFoundError('Seller not found');
      }
      
      // Update verification fields
      const updateData = {};
      if (isVerified !== undefined) {
        updateData.isVerified = isVerified;
      }
      if (status) {
        updateData.status = status;
      }
      if (notes) {
        updateData.verificationNotes = notes;
      }
      
      // Update the seller
      const updatedSeller = await ESMSeller.findByIdAndUpdate(
        id,
        updateData,
        { new: true, select: '-password' }
      );
      
      res.json({
        success: true,
        data: {
          id: updatedSeller._id,
          name: updatedSeller.fullName,
          email: updatedSeller.email,
          isVerified: updatedSeller.isVerified,
          status: updatedSeller.status,
          verificationNotes: updatedSeller.verificationNotes
        },
        message: 'Seller verification updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all pending approvals
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getPendingApprovals(req, res, next) {
    try {
      // Return mock approvals data
      const approvalsData = {
        approvals: [
          { id: '1', type: 'seller', itemName: 'Test Seller', status: 'pending', submittedAt: new Date() },
          { id: '2', type: 'product', itemName: 'Test Product', status: 'pending', submittedAt: new Date() }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      };
      
      res.json({
        success: true,
        data: approvalsData
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Process batch approvals
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async processBatchApprovals(req, res, next) {
    try {
      const { approvals } = req.body;
      
      if (!approvals || !Array.isArray(approvals)) {
        throw new BadRequestError('Invalid approvals data');
      }
      
      // Mock batch processing
      const results = {
        successful: approvals.filter(item => item.action && item.id),
        failed: approvals.filter(item => !item.action || !item.id)
      };
      
      res.json({
        success: true,
        data: results,
        message: `Processed ${results.successful.length} approvals successfully, ${results.failed.length} failed`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders for admin management
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrders(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        paymentStatus,
        dateFrom,
        dateTo,
        sellerId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter query
      const filter = {};
      if (status) filter.status = status;
      if (paymentStatus) filter['payment.status'] = paymentStatus;
      if (sellerId) filter.seller = sellerId;
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get orders with populated references
      const orders = await Order.find(filter)
        .populate('buyer', 'fullName email phone')
        .populate('seller', 'businessName contactPerson.name contactPerson.email')
        .populate('items.product', 'title price category')
        .populate('items.service', 'title price category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalOrders = await Order.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      // Calculate statistics
      const stats = await this._getOrderStatsForFilter(filter);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalOrders,
            pages: totalPages
          },
          stats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific order by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id)
        .populate('buyer', 'fullName email phone profilePicture')
        .populate('seller', 'businessName contactPerson email phone address isVerified')
        .populate('items.product', 'title price category images description')
        .populate('items.service', 'title price category images description')
        .populate('statusHistory.updatedBy', 'fullName email');

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status (admin override)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestError('Invalid order status');
      }

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Update status with admin override
      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated by admin to ${status}`,
        updatedBy: req.user.id
      });

      // Handle special status updates
      if (status === 'completed') {
        order.isFulfilled = true;
        order.fulfillmentDate = new Date();
      }

      await order.save();

      res.json({
        success: true,
        data: order,
        message: `Order status updated to ${status}`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payment status (admin override)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updatePaymentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { paymentStatus, transactionId, gatewayResponse } = req.body;

      const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        throw new BadRequestError('Invalid payment status');
      }

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Update payment status
      order.payment.status = paymentStatus;
      if (transactionId) order.payment.transactionId = transactionId;
      if (gatewayResponse) order.payment.gatewayResponse = gatewayResponse;

      // Add to status history
      order.statusHistory.push({
        status: order.status,
        timestamp: new Date(),
        note: `Payment status updated to ${paymentStatus} by admin`,
        updatedBy: req.user.id
      });

      await order.save();

      res.json({
        success: true,
        data: order,
        message: `Payment status updated to ${paymentStatus}`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel order (admin action)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (!order.canBeCancelled()) {
        throw new BadRequestError(`Cannot cancel order with status: ${order.status}`);
      }

      // Cancel order using model method
      await order.cancel(reason || 'Cancelled by admin');

      // Add admin info to status history
      const lastHistoryEntry = order.statusHistory[order.statusHistory.length - 1];
      lastHistoryEntry.updatedBy = req.user.id;
      await order.save();

      res.json({
        success: true,
        data: order,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process refund (admin action)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async processRefund(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.payment.status === 'refunded') {
        throw new BadRequestError('Order is already refunded');
      }

      // Process refund using model method
      await order.refund(amount, reason || 'Refund processed by admin');

      // Add admin info to status history
      const lastHistoryEntry = order.statusHistory[order.statusHistory.length - 1];
      lastHistoryEntry.updatedBy = req.user.id;
      await order.save();

      res.json({
        success: true,
        data: order,
        message: 'Refund processed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comprehensive order statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getOrderStats(req, res, next) {
    try {
      const { timeframe = '30d', sellerId } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate;
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const filter = { createdAt: { $gte: startDate } };
      if (sellerId) filter.seller = sellerId;

      // Get comprehensive statistics
      const stats = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            refundedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
            },
            successfulPayments: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'completed'] }, 1, 0] }
            },
            failedPayments: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'failed'] }, 1, 0] }
            }
          }
        }
      ]);

      // Get daily order trend
      const dailyTrend = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      // Get top sellers
      const topSellers = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$seller',
            orders: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'esmsellers',
            localField: '_id',
            foreignField: '_id',
            as: 'sellerInfo'
          }
        }
      ]);

      const result = {
        summary: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          completedOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          refundedOrders: 0,
          successfulPayments: 0,
          failedPayments: 0
        },
        dailyTrend,
        topSellers,
        timeframe,
        dateRange: { start: startDate, end: now }
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper method to get order statistics for a given filter
   * @private
   */
  async _getOrderStatsForFilter(filter) {
    const totalOrders = await Order.countDocuments(filter);
    const completedOrders = await Order.countDocuments({ ...filter, status: 'completed' });
    const pendingOrders = await Order.countDocuments({ ...filter, status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ ...filter, status: 'cancelled' });
    
    const revenueStats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      averageOrderValue: revenueStats[0]?.averageOrderValue || 0
    };
  }
}

module.exports = new AdminController();