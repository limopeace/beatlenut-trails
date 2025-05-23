const ESMReview = require('./mongoose/esmReviewModel');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * ESM Review model for handling operations related to product and seller reviews
 */
class ESMReviewModel {
  /**
   * Create a new review
   * @param {Object} reviewData - Data for creating the review
   * @returns {Promise<Object>} Newly created review
   */
  async create(reviewData) {
    try {
      // Check if user has already reviewed this product
      const existingReview = await ESMReview.findOne({
        product: reviewData.product,
        user: reviewData.user
      });
      
      if (existingReview) {
        throw new BadRequestError('You have already reviewed this product');
      }
      
      const review = new ESMReview(reviewData);
      await review.save();
      return review;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a review by ID
   * @param {string} id - Review ID
   * @returns {Promise<Object>} Review data
   */
  async findById(id) {
    const review = await ESMReview.findById(id)
      .populate('user', 'name')
      .populate('product', 'name images')
      .populate('seller', 'fullName businessName');
      
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    
    return review;
  }

  /**
   * Update a review
   * @param {string} id - Review ID
   * @param {string} userId - User ID (for verification)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated review data
   */
  async update(id, userId, updateData) {
    // First check if review exists and belongs to the user
    const review = await ESMReview.findOne({ _id: id, user: userId });
    
    if (!review) {
      throw new NotFoundError('Review not found or you do not have permission to update it');
    }
    
    // Prevent updating protected fields
    const protectedFields = ['user', 'product', 'seller', 'isVerifiedPurchase', 'createdAt'];
    for (const field of protectedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }
    
    const updatedReview = await ESMReview.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
      .populate('user', 'name')
      .populate('product', 'name images')
      .populate('seller', 'fullName businessName');
    
    return updatedReview;
  }

  /**
   * Delete a review
   * @param {string} id - Review ID
   * @param {string} userId - User ID (for verification)
   * @returns {Promise<boolean>} Success indicator
   */
  async delete(id, userId) {
    const result = await ESMReview.deleteOne({ _id: id, user: userId });
    
    if (result.deletedCount === 0) {
      throw new NotFoundError('Review not found or you do not have permission to delete it');
    }
    
    return true;
  }

  /**
   * Add seller response to a review
   * @param {string} id - Review ID
   * @param {string} sellerId - Seller ID (for verification)
   * @param {string} responseContent - Response content
   * @returns {Promise<Object>} Updated review
   */
  async addSellerResponse(id, sellerId, responseContent) {
    const review = await ESMReview.findById(id);
    
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    
    if (review.seller.toString() !== sellerId) {
      throw new ForbiddenError('You do not have permission to respond to this review');
    }
    
    review.sellerResponse = {
      content: responseContent,
      createdAt: new Date()
    };
    
    await review.save();
    
    return review;
  }

  /**
   * Update review moderation (admin function)
   * @param {string} id - Review ID
   * @param {boolean} isApproved - Approval status
   * @param {boolean} isHidden - Visibility status
   * @returns {Promise<Object>} Updated review
   */
  async updateModeration(id, isApproved, isHidden) {
    const review = await ESMReview.findByIdAndUpdate(
      id,
      { isApproved, isHidden },
      { new: true }
    )
      .populate('user', 'name')
      .populate('product', 'name images')
      .populate('seller', 'fullName businessName');
    
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    
    return review;
  }

  /**
   * Vote on review helpfulness
   * @param {string} id - Review ID
   * @param {string} userId - User ID voting
   * @param {string} vote - Vote type ('helpful' or 'not_helpful')
   * @returns {Promise<Object>} Updated review
   */
  async voteHelpfulness(id, userId, vote) {
    if (!['helpful', 'not_helpful'].includes(vote)) {
      throw new BadRequestError('Invalid vote type');
    }
    
    const review = await ESMReview.findById(id);
    
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    
    // Check if user has already voted
    const existingVoteIndex = review.helpfulness.voters.findIndex(
      v => v.user.toString() === userId
    );
    
    if (existingVoteIndex !== -1) {
      // User already voted, update their vote if different
      const existingVote = review.helpfulness.voters[existingVoteIndex].vote;
      
      if (existingVote !== vote) {
        // Decrement previous vote count
        review.helpfulness[existingVote === 'helpful' ? 'helpful' : 'notHelpful']--;
        
        // Increment new vote count
        review.helpfulness[vote === 'helpful' ? 'helpful' : 'notHelpful']++;
        
        // Update vote
        review.helpfulness.voters[existingVoteIndex].vote = vote;
      }
    } else {
      // User hasn't voted yet, add new vote
      review.helpfulness.voters.push({
        user: userId,
        vote
      });
      
      // Increment vote count
      review.helpfulness[vote === 'helpful' ? 'helpful' : 'notHelpful']++;
    }
    
    await review.save();
    
    return review;
  }

  /**
   * Get reviews for a product
   * @param {string} productId - Product ID
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated reviews with metadata
   */
  async getForProduct(productId, filters = {}, page = 1, limit = 10) {
    const query = { 
      product: productId,
      isHidden: false,
      isApproved: true
    };
    
    // Apply rating filter if provided
    if (filters.rating) {
      query.rating = filters.rating;
    }
    
    // Get total count for pagination
    const total = await ESMReview.countDocuments(query);
    
    // Calculate rating distribution
    const ratingDistribution = await ESMReview.aggregate([
      { $match: { product: productId, isHidden: false, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    // Format rating distribution
    const distribution = {};
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });
    
    // Build sort options
    let sortOptions = {};
    
    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'helpful':
          sortOptions = { 'helpfulness.helpful': -1 };
          break;
        case 'rating-high':
          sortOptions = { rating: -1 };
          break;
        case 'rating-low':
          sortOptions = { rating: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 }; // Default sort by newest
      }
    } else {
      sortOptions = { createdAt: -1 }; // Default sort by newest
    }
    
    // Get reviews with pagination
    const reviews = await ESMReview.find(query)
      .populate('user', 'name')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      reviews,
      summary: {
        total,
        distribution,
        averageRating: total > 0 
          ? Object.entries(distribution).reduce((sum, [rating, count]) => sum + (Number(rating) * count), 0) / total 
          : 0
      },
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get reviews for a seller
   * @param {string} sellerId - Seller ID
   * @param {Object} filters - Filters to apply
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated reviews with metadata
   */
  async getForSeller(sellerId, filters = {}, page = 1, limit = 10) {
    const query = { 
      seller: sellerId,
      isHidden: false,
      isApproved: true
    };
    
    // Apply rating filter if provided
    if (filters.rating) {
      query.rating = filters.rating;
    }
    
    // Get total count for pagination
    const total = await ESMReview.countDocuments(query);
    
    // Calculate rating distribution
    const ratingDistribution = await ESMReview.aggregate([
      { $match: { seller: sellerId, isHidden: false, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    // Format rating distribution
    const distribution = {};
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });
    
    // Get reviews with pagination
    const reviews = await ESMReview.find(query)
      .populate('user', 'name')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      reviews,
      summary: {
        total,
        distribution,
        averageRating: total > 0 
          ? Object.entries(distribution).reduce((sum, [rating, count]) => sum + (Number(rating) * count), 0) / total 
          : 0
      },
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ESMReviewModel();