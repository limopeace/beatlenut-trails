const Approval = require('../models/mongoose/approvalModel');
const ESMSeller = require('../models/mongoose/esmSellerModel');
const ESMProduct = require('../models/mongoose/esmProductModel');
const ESMService = require('../models/mongoose/esmServiceModel');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const mongoose = require('mongoose');

/**
 * Repository for Approval operations
 */
class ApprovalRepository {
  /**
   * Create a new approval
   * @param {Object} approvalData - Approval data
   * @returns {Promise<Object>} Created approval
   */
  async createApproval(approvalData) {
    const approval = new Approval(approvalData);
    await approval.save();
    return approval;
  }

  /**
   * Get approval by ID
   * @param {string} approvalId - Approval ID
   * @returns {Promise<Object>} Approval object
   */
  async getApprovalById(approvalId) {
    if (!mongoose.Types.ObjectId.isValid(approvalId)) {
      throw new BadRequestError('Invalid approval ID');
    }

    const approval = await Approval.findById(approvalId);
    if (!approval) {
      throw new NotFoundError('Approval not found');
    }

    return approval;
  }

  /**
   * Get approvals with filters and pagination
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated approvals
   */
  async getApprovals(filters = {}, page = 1, limit = 10) {
    const query = this._buildQuery(filters);
    const skip = (page - 1) * limit;
    
    const [approvals, total] = await Promise.all([
      Approval.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Approval.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      approvals,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Update approval status
   * @param {string} approvalId - Approval ID
   * @param {string} status - New status ('approved' or 'rejected')
   * @param {string} adminId - Admin user ID
   * @param {Object} data - Additional data (notes, reason, etc.)
   * @returns {Promise<Object>} Updated approval
   */
  async updateApprovalStatus(approvalId, status, adminId, data = {}) {
    const approval = await this.getApprovalById(approvalId);
    
    if (approval.status !== 'pending') {
      throw new BadRequestError(`Approval is already ${approval.status}`);
    }
    
    approval.status = status;
    
    if (status === 'approved') {
      approval.approvedBy = adminId;
      approval.approvedAt = new Date();
      approval.adminNotes = data.notes || approval.adminNotes;
      
      // Update the related item status based on approval type
      await this._updateRelatedItemStatus(approval, true, data);
    } else if (status === 'rejected') {
      approval.rejectedBy = adminId;
      approval.rejectedAt = new Date();
      approval.rejectionReason = data.reason;
      approval.adminNotes = data.notes || approval.adminNotes;
      
      // Update the related item status based on approval type
      await this._updateRelatedItemStatus(approval, false, data);
    }
    
    await approval.save();
    return approval;
  }

  /**
   * Update document status within an approval
   * @param {string} approvalId - Approval ID
   * @param {string} documentId - Document ID
   * @param {string} status - New document status
   * @returns {Promise<Object>} Updated approval
   */
  async updateDocumentStatus(approvalId, documentId, status) {
    const approval = await this.getApprovalById(approvalId);
    
    const documentIndex = approval.documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      throw new NotFoundError('Document not found in this approval');
    }
    
    approval.documents[documentIndex].status = status;
    await approval.save();
    
    return approval;
  }

  /**
   * Helper to update related item status based on approval type
   * @param {Object} approval - Approval document
   * @param {boolean} isApproved - Whether approval was approved or rejected
   * @param {Object} data - Additional data
   * @private
   */
  async _updateRelatedItemStatus(approval, isApproved, data) {
    try {
      const { type, itemId, itemModel } = approval;
      
      switch (type) {
        case 'seller_registration':
          await ESMSeller.findByIdAndUpdate(
            approval.requesterId,
            {
              isVerified: isApproved,
              status: isApproved ? 'active' : 'rejected',
              verificationNotes: data.notes || ''
            }
          );
          break;
          
        case 'product_listing':
          if (itemId && itemModel === 'ESMProduct') {
            await ESMProduct.findByIdAndUpdate(
              itemId,
              {
                status: isApproved ? 'active' : 'rejected',
                rejectionReason: isApproved ? '' : (data.reason || '')
              }
            );
          }
          break;
          
        case 'service_listing':
          if (itemId && itemModel === 'ESMService') {
            await ESMService.findByIdAndUpdate(
              itemId,
              {
                status: isApproved ? 'active' : 'rejected',
                rejectionReason: isApproved ? '' : (data.reason || '')
              }
            );
          }
          break;
          
        case 'document_verification':
          // Handle document verification updates if needed
          break;
      }
    } catch (error) {
      console.error('Error updating related item status:', error);
      throw new Error('Failed to update related item status');
    }
  }

  /**
   * Build query object from filters
   * @param {Object} filters - Filter criteria
   * @returns {Object} MongoDB query object
   * @private
   */
  _buildQuery(filters) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.requesterId) {
      query.requesterId = filters.requesterId;
    }
    
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { requesterName: searchRegex },
        { requesterEmail: searchRegex },
        { requesterBusinessName: searchRegex },
        { itemName: searchRegex }
      ];
    }
    
    if (filters.dateFrom) {
      query.createdAt = { $gte: new Date(filters.dateFrom) };
    }
    
    if (filters.dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.dateTo) };
    }
    
    return query;
  }

  /**
   * Get approval counts by status and type
   * @returns {Promise<Object>} Count statistics
   */
  async getApprovalCounts() {
    const totalPending = await Approval.countDocuments({ status: 'pending' });
    const sellerPending = await Approval.countDocuments({ 
      status: 'pending', 
      type: 'seller_registration' 
    });
    const productPending = await Approval.countDocuments({ 
      status: 'pending', 
      type: 'product_listing' 
    });
    const servicePending = await Approval.countDocuments({ 
      status: 'pending', 
      type: 'service_listing' 
    });
    const documentPending = await Approval.countDocuments({ 
      status: 'pending', 
      type: 'document_verification' 
    });
    
    return {
      totalPending,
      sellerPending,
      productPending,
      servicePending,
      documentPending
    };
  }
}

module.exports = new ApprovalRepository();