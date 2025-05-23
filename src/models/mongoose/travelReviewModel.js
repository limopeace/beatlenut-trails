/**
 * Travel Listing Review Model
 * Stores reviews for travel listings
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelReviewSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'TravelListing',
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  images: [{
    url: String,
    caption: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  travelDate: {
    type: Date,
    default: null
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  adminResponse: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster querying
travelReviewSchema.index({ listingId: 1, approved: 1, createdAt: -1 });
travelReviewSchema.index({ featured: 1, approved: 1 });

/**
 * Find approved reviews for a listing
 */
travelReviewSchema.statics.findApprovedByListingId = function(listingId, limit = 10, skip = 0) {
  return this.find({
    listingId,
    approved: true
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Find featured reviews for homepage
 */
travelReviewSchema.statics.findFeatured = function(limit = 5) {
  return this.find({
    featured: true,
    approved: true
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Calculate average rating for a listing
 */
travelReviewSchema.statics.calculateAverageRating = async function(listingId) {
  const result = await this.aggregate([
    {
      $match: {
        listingId: mongoose.Types.ObjectId(listingId),
        approved: true
      }
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { avgRating: 0, count: 0 };
};

/**
 * Update the listing's average rating when a review is added, updated or removed
 */
travelReviewSchema.post('save', async function() {
  const TravelListing = mongoose.model('TravelListing');
  const stats = await this.constructor.calculateAverageRating(this.listingId);
  
  await TravelListing.findByIdAndUpdate(this.listingId, {
    'reviews.average': stats.avgRating,
    'reviews.count': stats.count
  });
});

const TravelReview = mongoose.model('TravelReview', travelReviewSchema);

module.exports = TravelReview;