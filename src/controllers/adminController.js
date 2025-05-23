const esmSellerService = require('../services/esmSellerService');
const esmProductService = require('../services/esmProductService');
const esmServiceRepository = require('../repositories/esmServiceRepository');
const approvalService = require('../services/approvalService');
const { BadRequestError } = require('../utils/errors');

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
      // Get pending approvals stats
      const approvalStats = await approvalService.getApprovalStats();
      
      // Get seller counts
      const sellerStats = {
        total: await esmSellerService.getSellerCount(),
        pending: await esmSellerService.getSellerCount({ status: 'pending' }),
        active: await esmSellerService.getSellerCount({ status: 'active' }),
        rejected: await esmSellerService.getSellerCount({ status: 'rejected' })
      };
      
      // Get product stats 
      const productStats = {
        total: await esmProductService.getProductCount(),
        pending: await esmProductService.getProductCount({ status: 'pending' }),
        active: await esmProductService.getProductCount({ status: 'active' }),
        rejected: await esmProductService.getProductCount({ status: 'rejected' })
      };
      
      // Get service stats (if service repository exists)
      let serviceStats = {};
      if (esmServiceRepository) {
        serviceStats = {
          total: await esmServiceRepository.getServiceCount(),
          pending: await esmServiceRepository.getServiceCount({ status: 'pending' }),
          active: await esmServiceRepository.getServiceCount({ status: 'active' }),
          rejected: await esmServiceRepository.getServiceCount({ status: 'rejected' })
        };
      }
      
      res.json({
        approvalStats,
        sellerStats,
        productStats,
        serviceStats,
        timestamp: new Date()
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
      const filters = {
        status: req.query.status,
        category: req.query.category,
        serviceBranch: req.query.serviceBranch,
        isVerified: req.query.isVerified === 'true',
        search: req.query.search
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      
      const result = await esmSellerService.getAllSellers(filters, page, limit, false);
      res.json(result);
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
      
      if (isVerified === undefined && !status) {
        throw new BadRequestError('Either verification status or account status is required');
      }
      
      let result;
      
      // If verifying a seller, use the verifySeller method
      if (isVerified !== undefined) {
        result = await esmSellerService.verifySeller(id, isVerified, notes);
      } 
      // If just updating status, use a different method
      else if (status) {
        result = await esmSellerService.updateSellerStatus(id, status);
      }
      
      res.json(result);
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: 'pending',
        type: req.query.type,
        search: req.query.search
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      
      const result = await approvalService.getApprovals(filters, page, limit);
      res.json(result);
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
      
      const results = {
        successful: [],
        failed: []
      };
      
      const adminId = req.user.id;
      
      // Process each approval in the batch
      for (const item of approvals) {
        try {
          const { id, action, reason, notes } = item;
          
          if (!id || !action) {
            results.failed.push({
              id: id || 'unknown',
              error: 'Missing required fields'
            });
            continue;
          }
          
          if (action === 'approve') {
            const approval = await approvalService.approveRequest(id, adminId, { notes });
            results.successful.push({
              id,
              action,
              type: approval.type,
              item: approval.itemName
            });
          } else if (action === 'reject') {
            if (!reason) {
              results.failed.push({
                id,
                error: 'Rejection reason is required'
              });
              continue;
            }
            
            const approval = await approvalService.rejectRequest(id, adminId, { reason, notes });
            results.successful.push({
              id,
              action,
              type: approval.type,
              item: approval.itemName
            });
          } else {
            results.failed.push({
              id,
              error: 'Invalid action'
            });
          }
        } catch (error) {
          results.failed.push({
            id: item.id || 'unknown',
            error: error.message
          });
        }
      }
      
      res.json({
        results,
        message: `Processed ${results.successful.length} approvals successfully, ${results.failed.length} failed`
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();