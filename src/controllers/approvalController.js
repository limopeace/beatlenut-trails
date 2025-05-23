const approvalService = require('../services/approvalService');
const { BadRequestError } = require('../utils/errors');

/**
 * Controller for approval operations
 */
class ApprovalController {
  /**
   * Get all approvals with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getApprovals(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: req.query.status,
        type: req.query.type,
        search: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
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
   * Get approval by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getApprovalById(req, res, next) {
    try {
      const approval = await approvalService.getApprovalById(req.params.id);
      res.json({ approval });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create seller registration approval (admin or auto-trigger)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createSellerApproval(req, res, next) {
    try {
      const { sellerId } = req.body;
      
      if (!sellerId) {
        throw new BadRequestError('Seller ID is required');
      }
      
      const approval = await approvalService.createSellerApproval(sellerId);
      res.status(201).json({ 
        approval,
        message: 'Seller approval request created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create product listing approval (admin or auto-trigger)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createProductApproval(req, res, next) {
    try {
      const { productId } = req.body;
      
      if (!productId) {
        throw new BadRequestError('Product ID is required');
      }
      
      const approval = await approvalService.createProductApproval(productId);
      res.status(201).json({ 
        approval,
        message: 'Product approval request created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create service listing approval (admin or auto-trigger)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createServiceApproval(req, res, next) {
    try {
      const { serviceId } = req.body;
      
      if (!serviceId) {
        throw new BadRequestError('Service ID is required');
      }
      
      const approval = await approvalService.createServiceApproval(serviceId);
      res.status(201).json({ 
        approval,
        message: 'Service approval request created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve an approval request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async approveRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const adminId = req.user.id;
      
      const approval = await approvalService.approveRequest(id, adminId, { notes });
      
      res.json({
        approval,
        message: `${this._formatApprovalType(approval.type)} approved successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject an approval request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async rejectRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { reason, notes } = req.body;
      const adminId = req.user.id;
      
      if (!reason) {
        throw new BadRequestError('Rejection reason is required');
      }
      
      const approval = await approvalService.rejectRequest(id, adminId, { reason, notes });
      
      res.json({
        approval,
        message: `${this._formatApprovalType(approval.type)} rejected`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update document status within an approval
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateDocumentStatus(req, res, next) {
    try {
      const { id, documentId } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'verified', 'rejected'].includes(status)) {
        throw new BadRequestError('Valid document status is required');
      }
      
      const approval = await approvalService.updateDocumentStatus(id, documentId, status);
      
      res.json({
        approval,
        message: 'Document status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get approval statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getApprovalStats(req, res, next) {
    try {
      const stats = await approvalService.getApprovalStats();
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Format approval type for display
   * @param {string} type - Approval type
   * @returns {string} Formatted type
   * @private
   */
  _formatApprovalType(type) {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

module.exports = new ApprovalController();