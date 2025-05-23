const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Apply authentication middleware for all admin routes
const isAdmin = authorize(['admin']);

/**
 * @route GET /api/admin/dashboard
 * @desc Get admin dashboard data
 * @access Private (Admin)
 */
router.get(
  '/dashboard',
  authenticate,
  isAdmin,
  adminController.getDashboardData
);

/**
 * @route GET /api/admin/sellers
 * @desc Get all sellers with admin-level details
 * @access Private (Admin)
 */
router.get(
  '/sellers',
  authenticate,
  isAdmin,
  adminController.getSellers
);

/**
 * @route PUT /api/admin/sellers/:id/verification
 * @desc Update seller verification status
 * @access Private (Admin)
 */
router.put(
  '/sellers/:id/verification',
  authenticate,
  isAdmin,
  adminController.updateSellerVerification
);

/**
 * @route GET /api/admin/approvals/pending
 * @desc Get all pending approvals
 * @access Private (Admin)
 */
router.get(
  '/approvals/pending',
  authenticate,
  isAdmin,
  adminController.getPendingApprovals
);

/**
 * @route POST /api/admin/approvals/batch
 * @desc Process multiple approvals in batch
 * @access Private (Admin)
 */
router.post(
  '/approvals/batch',
  authenticate,
  isAdmin,
  adminController.processBatchApprovals
);

module.exports = router;