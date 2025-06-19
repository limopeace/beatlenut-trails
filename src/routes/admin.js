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

/**
 * @route GET /api/admin/orders
 * @desc Get all orders for admin management
 * @access Private (Admin)
 */
router.get(
  '/orders',
  authenticate,
  isAdmin,
  adminController.getOrders
);

/**
 * @route GET /api/admin/orders/:id
 * @desc Get specific order details by ID
 * @access Private (Admin)
 */
router.get(
  '/orders/:id',
  authenticate,
  isAdmin,
  adminController.getOrderById
);

/**
 * @route PUT /api/admin/orders/:id/status
 * @desc Update order status (admin override)
 * @access Private (Admin)
 */
router.put(
  '/orders/:id/status',
  authenticate,
  isAdmin,
  adminController.updateOrderStatus
);

/**
 * @route PUT /api/admin/orders/:id/payment-status
 * @desc Update payment status (admin override)
 * @access Private (Admin)
 */
router.put(
  '/orders/:id/payment-status',
  authenticate,
  isAdmin,
  adminController.updatePaymentStatus
);

/**
 * @route POST /api/admin/orders/:id/cancel
 * @desc Cancel order (admin action)
 * @access Private (Admin)
 */
router.post(
  '/orders/:id/cancel',
  authenticate,
  isAdmin,
  adminController.cancelOrder
);

/**
 * @route POST /api/admin/orders/:id/refund
 * @desc Process refund (admin action)
 * @access Private (Admin)
 */
router.post(
  '/orders/:id/refund',
  authenticate,
  isAdmin,
  adminController.processRefund
);

/**
 * @route GET /api/admin/orders/stats
 * @desc Get comprehensive order statistics
 * @access Private (Admin)
 */
router.get(
  '/orders/stats',
  authenticate,
  isAdmin,
  adminController.getOrderStats
);

module.exports = router;