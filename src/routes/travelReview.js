/**
 * Travel Review Routes
 * Defines API routes for travel reviews
 */

const express = require('express');
const router = express.Router();
const travelReviewController = require('../controllers/travelReviewController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const travelReviewValidator = require('../validators/travelReview');

// Public routes
router.get('/listing/:listingId', travelReviewController.getReviewsByListing);
router.get('/featured', travelReviewController.getFeaturedReviews);
router.post('/', validate(travelReviewValidator.createReview), travelReviewController.createReview);

// Admin routes (protected)
router.get('/', authenticate, travelReviewController.getAllReviews);
router.get('/:id', authenticate, travelReviewController.getReviewById);
router.put('/:id', authenticate, validate(travelReviewValidator.updateReview), travelReviewController.updateReview);
router.delete('/:id', authenticate, travelReviewController.deleteReview);
router.patch('/:id/approve', authenticate, travelReviewController.toggleApproval);
router.patch('/:id/feature', authenticate, travelReviewController.toggleFeatured);
router.patch('/:id/respond', authenticate, validate(travelReviewValidator.adminResponse), travelReviewController.addAdminResponse);

module.exports = router;