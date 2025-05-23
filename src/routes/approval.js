const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const approvalValidator = require('../validators/approval');

// Apply authentication middleware for all approval routes
const isAdmin = authorize(['admin']);

/**
 * @route GET /api/approvals
 * @desc Get all approvals with filtering
 * @access Private (Admin)
 */
router.get(
  '/',
  authenticate,
  isAdmin,
  approvalController.getApprovals
);

/**
 * @route GET /api/approvals/stats
 * @desc Get approval statistics
 * @access Private (Admin)
 */
router.get(
  '/stats',
  authenticate,
  isAdmin,
  approvalController.getApprovalStats
);

/**
 * @route GET /api/approvals/:id
 * @desc Get approval by ID
 * @access Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  isAdmin,
  approvalController.getApprovalById
);

/**
 * @route POST /api/approvals/seller
 * @desc Create seller registration approval
 * @access Private (Admin or System)
 */
router.post(
  '/seller',
  authenticate,
  isAdmin,
  validate(approvalValidator.createSellerApproval),
  approvalController.createSellerApproval
);

/**
 * @route POST /api/approvals/product
 * @desc Create product listing approval
 * @access Private (Admin or System)
 */
router.post(
  '/product',
  authenticate,
  isAdmin,
  validate(approvalValidator.createProductApproval),
  approvalController.createProductApproval
);

/**
 * @route POST /api/approvals/service
 * @desc Create service listing approval
 * @access Private (Admin or System)
 */
router.post(
  '/service',
  authenticate,
  isAdmin,
  validate(approvalValidator.createServiceApproval),
  approvalController.createServiceApproval
);

/**
 * @route POST /api/approvals/:id/approve
 * @desc Approve an approval request
 * @access Private (Admin)
 */
router.post(
  '/:id/approve',
  authenticate,
  isAdmin,
  validate(approvalValidator.approveRequest),
  approvalController.approveRequest
);

/**
 * @route POST /api/approvals/:id/reject
 * @desc Reject an approval request
 * @access Private (Admin)
 */
router.post(
  '/:id/reject',
  authenticate,
  isAdmin,
  validate(approvalValidator.rejectRequest),
  approvalController.rejectRequest
);

/**
 * @route PATCH /api/approvals/:id/document/:documentId
 * @desc Update document status within an approval
 * @access Private (Admin)
 */
router.patch(
  '/:id/document/:documentId',
  authenticate,
  isAdmin,
  validate(approvalValidator.updateDocumentStatus),
  approvalController.updateDocumentStatus
);

module.exports = router;