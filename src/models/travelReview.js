/**
 * Travel Review model interface
 */

const TravelReviewModel = require('./mongoose/travelReviewModel');
const mongoose = require('mongoose');

/**
 * Create a new travel review
 */
exports.create = async (reviewData) => {
  try {
    const review = new TravelReviewModel(reviewData);
    return await review.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Get review by ID
 */
exports.getById = async (id) => {
  try {
    return await TravelReviewModel.findById(id);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all reviews for a listing
 */
exports.getByListingId = async (listingId, options = {}) => {
  try {
    const { limit = 10, skip = 0, approvedOnly = true } = options;
    
    const query = { listingId };
    if (approvedOnly) {
      query.approved = true;
    }
    
    return await TravelReviewModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  } catch (error) {
    throw error;
  }
};

/**
 * Get featured reviews for homepage
 */
exports.getFeatured = async (limit = 5) => {
  try {
    return await TravelReviewModel.findFeatured(limit);
  } catch (error) {
    throw error;
  }
};

/**
 * Update a review
 */
exports.update = async (id, updateData) => {
  try {
    return await TravelReviewModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a review
 */
exports.delete = async (id) => {
  try {
    const review = await TravelReviewModel.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    
    const listingId = review.listingId;
    await review.remove();
    
    // Recalculate average rating
    const stats = await TravelReviewModel.calculateAverageRating(listingId);
    
    const TravelListingModel = require('./mongoose/travelListingModel');
    await TravelListingModel.findByIdAndUpdate(listingId, {
      'reviews.average': stats.avgRating,
      'reviews.count': stats.count
    });
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle approval status
 */
exports.toggleApproval = async (id) => {
  try {
    const review = await TravelReviewModel.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    
    review.approved = !review.approved;
    await review.save();
    
    return review;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle featured status
 */
exports.toggleFeatured = async (id) => {
  try {
    const review = await TravelReviewModel.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Review must be approved to be featured
    if (!review.approved && !review.featured) {
      throw new Error('Review must be approved before it can be featured');
    }
    
    review.featured = !review.featured;
    await review.save();
    
    return review;
  } catch (error) {
    throw error;
  }
};

/**
 * Add admin response to a review
 */
exports.addAdminResponse = async (id, response) => {
  try {
    return await TravelReviewModel.findByIdAndUpdate(
      id,
      { adminResponse: response, updatedAt: Date.now() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};