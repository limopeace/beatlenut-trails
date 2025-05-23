const express = require('express');
const router = express.Router();
const esmSellerController = require('../controllers/esmSeller');
const { authenticate, authorize } = require('../middleware/auth');
const isAdmin = authorize(['admin']);
const { validate } = require('../middleware/validator');
const esmSellerValidator = require('../validators/esmSeller');

/**
 * @route POST /api/esm/sellers/register
 * @desc Register a new ESM seller
 * @access Public
 */
router.post(
  '/register',
  validate(esmSellerValidator.register),
  esmSellerController.register
);

/**
 * @route POST /api/esm/sellers/login
 * @desc Login as ESM seller
 * @access Public
 */
router.post(
  '/login',
  validate(esmSellerValidator.login),
  esmSellerController.login
);

/**
 * @route GET /api/esm/sellers/profile
 * @desc Get seller's own profile
 * @access Private (Seller)
 */
router.get(
  '/profile',
  authenticate,
  esmSellerController.getProfile
);

/**
 * @route PUT /api/esm/sellers/profile
 * @desc Update seller's own profile
 * @access Private (Seller)
 */
router.put(
  '/profile',
  authenticate,
  validate(esmSellerValidator.updateProfile),
  esmSellerController.updateProfile
);

/**
 * @route PUT /api/esm/sellers/change-password
 * @desc Change seller password
 * @access Private (Seller)
 */
router.put(
  '/change-password',
  authenticate,
  validate(esmSellerValidator.changePassword),
  esmSellerController.changePassword
);

/**
 * @route GET /api/esm/sellers
 * @desc Get all sellers (admin function)
 * @access Private (Admin)
 */
router.get(
  '/',
  authenticate,
  isAdmin,
  esmSellerController.getAllSellers
);

/**
 * @route GET /api/esm/sellers/directory
 * @desc Get public seller directory
 * @access Public
 */
router.get(
  '/directory',
  esmSellerController.getSellerDirectory
);

/**
 * @route GET /api/esm/sellers/:id
 * @desc Get seller by ID
 * @access Public
 */
router.get(
  '/:id',
  esmSellerController.getSellerById
);

/**
 * @route PUT /api/esm/sellers/:id/verify
 * @desc Verify a seller (admin function)
 * @access Private (Admin)
 */
router.put(
  '/:id/verify',
  authenticate,
  isAdmin,
  validate(esmSellerValidator.verifySeller),
  esmSellerController.verifySeller
);

module.exports = router;