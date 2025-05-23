const approvalRepository = require('../repositories/approvalRepository');
const esmSellerRepository = require('../repositories/esmSellerRepository');
const esmProductRepository = require('../repositories/esmProductRepository');
const esmServiceRepository = require('../repositories/esmServiceRepository');
const { BadRequestError, NotFoundError } = require('../utils/errors');

/**
 * Service for Approval operations
 */
class ApprovalService {
  /**
   * Create a new seller registration approval
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Object>} Created approval
   */
  async createSellerApproval(sellerId) {
    try {
      const seller = await esmSellerRepository.getSellerById(sellerId);
      
      // Check if seller already has a pending approval
      const pendingApprovals = await approvalRepository.getApprovals({
        type: 'seller_registration',
        status: 'pending',
        requesterId: sellerId
      }, 1, 1);
      
      if (pendingApprovals.approvals.length > 0) {
        return pendingApprovals.approvals[0]; // Return existing approval
      }
      
      // Create new approval
      const approvalData = {
        type: 'seller_registration',
        status: 'pending',
        requesterId: sellerId,
        requesterModel: 'ESMSeller',
        requesterName: seller.fullName,
        requesterEmail: seller.email,
        requesterBusinessName: seller.businessName || '',
        requesterProfileImage: seller.profileImage || '',
        itemId: sellerId,
        itemModel: 'ESMSeller',
        itemName: seller.fullName,
        itemDetails: {
          serviceBranch: seller.serviceBranch,
          rank: seller.rank,
          serviceNumber: seller.serviceNumber,
          serviceYears: seller.serviceYears,
          category: seller.category,
          location: seller.location
        },
        documents: [
          {
            id: seller._id.toString() + '_verification',
            type: 'Verification Document',
            name: 'Service Verification',
            path: seller.verificationDocument,
            status: 'pending'
          }
        ],
        requesterNotes: seller.verificationNotes || ''
      };
      
      return await approvalRepository.createApproval(approvalData);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create seller approval: ${error.message}`);
    }
  }

  /**
   * Create a new product listing approval
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Created approval
   */
  async createProductApproval(productId) {
    try {
      const product = await esmProductRepository.getProductById(productId);
      const seller = await esmSellerRepository.getSellerById(product.sellerId);
      
      // Check if product already has a pending approval
      const pendingApprovals = await approvalRepository.getApprovals({
        type: 'product_listing',
        status: 'pending',
        itemId: productId
      }, 1, 1);
      
      if (pendingApprovals.approvals.length > 0) {
        return pendingApprovals.approvals[0]; // Return existing approval
      }
      
      // Create new approval
      const approvalData = {
        type: 'product_listing',
        status: 'pending',
        requesterId: seller._id,
        requesterModel: 'ESMSeller',
        requesterName: seller.fullName,
        requesterEmail: seller.email,
        requesterBusinessName: seller.businessName || '',
        requesterProfileImage: seller.profileImage || '',
        itemId: productId,
        itemModel: 'ESMProduct',
        itemName: product.name,
        itemDetails: {
          description: product.description,
          price: product.price,
          category: product.category,
          images: product.images
        },
        documents: product.certificates ? product.certificates.map((cert, index) => ({
          id: `${productId}_cert_${index}`,
          type: 'Product Certificate',
          name: cert.name || 'Certificate',
          path: cert.path,
          status: 'pending'
        })) : []
      };
      
      return await approvalRepository.createApproval(approvalData);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create product approval: ${error.message}`);
    }
  }

  /**
   * Create a new service listing approval
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Created approval
   */
  async createServiceApproval(serviceId) {
    try {
      const service = await esmServiceRepository.getServiceById(serviceId);
      const seller = await esmSellerRepository.getSellerById(service.sellerId);
      
      // Check if service already has a pending approval
      const pendingApprovals = await approvalRepository.getApprovals({
        type: 'service_listing',
        status: 'pending',
        itemId: serviceId
      }, 1, 1);
      
      if (pendingApprovals.approvals.length > 0) {
        return pendingApprovals.approvals[0]; // Return existing approval
      }
      
      // Create new approval
      const approvalData = {
        type: 'service_listing',
        status: 'pending',
        requesterId: seller._id,
        requesterModel: 'ESMSeller',
        requesterName: seller.fullName,
        requesterEmail: seller.email,
        requesterBusinessName: seller.businessName || '',
        requesterProfileImage: seller.profileImage || '',
        itemId: serviceId,
        itemModel: 'ESMService',
        itemName: service.name,
        itemDetails: {
          description: service.description,
          price: service.price,
          category: service.category,
          images: service.images
        },
        documents: service.certificates ? service.certificates.map((cert, index) => ({
          id: `${serviceId}_cert_${index}`,
          type: 'Service Certificate',
          name: cert.name || 'Certificate',
          path: cert.path,
          status: 'pending'
        })) : []
      };
      
      return await approvalRepository.createApproval(approvalData);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to create service approval: ${error.message}`);
    }
  }

  /**
   * Get all approvals with filtering and pagination
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated approvals
   */
  async getApprovals(filters = {}, page = 1, limit = 10) {
    return await approvalRepository.getApprovals(filters, page, limit);
  }

  /**
   * Get approval by ID
   * @param {string} approvalId - Approval ID
   * @returns {Promise<Object>} Approval details
   */
  async getApprovalById(approvalId) {
    return await approvalRepository.getApprovalById(approvalId);
  }

  /**
   * Approve an approval request
   * @param {string} approvalId - Approval ID
   * @param {string} adminId - Admin user ID
   * @param {Object} data - Additional data (notes)
   * @returns {Promise<Object>} Updated approval
   */
  async approveRequest(approvalId, adminId, data = {}) {
    return await approvalRepository.updateApprovalStatus(approvalId, 'approved', adminId, data);
  }

  /**
   * Reject an approval request
   * @param {string} approvalId - Approval ID
   * @param {string} adminId - Admin user ID
   * @param {Object} data - Rejection data (reason, notes)
   * @returns {Promise<Object>} Updated approval
   */
  async rejectRequest(approvalId, adminId, data = {}) {
    if (!data.reason) {
      throw new BadRequestError('Rejection reason is required');
    }
    
    return await approvalRepository.updateApprovalStatus(approvalId, 'rejected', adminId, data);
  }

  /**
   * Update document status within an approval
   * @param {string} approvalId - Approval ID
   * @param {string} documentId - Document ID
   * @param {string} status - New document status
   * @returns {Promise<Object>} Updated approval
   */
  async updateDocumentStatus(approvalId, documentId, status) {
    return await approvalRepository.updateDocumentStatus(approvalId, documentId, status);
  }

  /**
   * Get approval statistics
   * @returns {Promise<Object>} Approval statistics
   */
  async getApprovalStats() {
    return await approvalRepository.getApprovalCounts();
  }
}

module.exports = new ApprovalService();