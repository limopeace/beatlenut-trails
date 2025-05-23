/**
 * Travel Review Controller
 * Handles API requests for travel reviews
 */

const TravelReview = require('../models/travelReview');
const TravelListing = require('../models/travelListing');
const { sanitizeInput } = require('../utils/sanitizer');

/**
 * Get all reviews for admin
 */
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, listingId, approved } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (listingId) query.listingId = listingId;
    if (approved !== undefined) query.approved = approved === 'true';
    
    const reviews = await TravelReview.getByListingId(
      listingId || null,
      {
        limit: parseInt(limit),
        skip: parseInt(skip),
        approvedOnly: approved !== undefined ? approved === 'true' : false
      }
    );
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews for a listing
 */
exports.getReviewsByListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const reviews = await TravelReview.getByListingId(
      listingId,
      {
        limit: parseInt(limit),
        skip: parseInt(skip),
        approvedOnly: true
      }
    );
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured reviews for homepage
 */
exports.getFeaturedReviews = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    
    const reviews = await TravelReview.getFeatured(parseInt(limit));
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new review
 */
exports.createReview = async (req, res, next) => {
  try {
    // Sanitize inputs
    const sanitizedData = sanitizeInput(req.body);
    
    // Verify that listing exists
    const listing = await TravelListing.getById(sanitizedData.listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    // Create review
    const review = await TravelReview.create({
      ...sanitizedData,
      // New reviews start as unapproved
      approved: false,
      featured: false
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * Get review by ID
 */
exports.getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await TravelReview.getById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a review
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Sanitize inputs
    const sanitizedData = sanitizeInput(req.body);
    
    const review = await TravelReview.update(id, sanitizedData);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await TravelReview.delete(id);
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle review approval
 */
exports.toggleApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await TravelReview.toggleApproval(id);
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle review featured status
 */
exports.toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await TravelReview.toggleFeatured(id);
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * Add admin response to a review
 */
exports.addAdminResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    
    // Sanitize input
    const sanitizedResponse = sanitizeInput(response);
    
    const review = await TravelReview.addAdminResponse(id, sanitizedResponse);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};