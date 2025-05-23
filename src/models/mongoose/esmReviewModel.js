const mongoose = require('mongoose');

const esmReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ESMProduct',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ESMSeller',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  // Optional fields for enhanced reviews
  pros: [{
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String
    },
    caption: {
      type: String,
      default: ''
    }
  }],
  // Verification
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  // Admin controls
  isApproved: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  // For seller responses
  sellerResponse: {
    content: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date
    }
  },
  // Helpfulness tracking
  helpfulness: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['helpful', 'not_helpful']
      }
    }]
  },
  // Tracking
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add hook to update product and seller ratings when a review is added or updated
esmReviewSchema.post('save', async function() {
  const ESMProduct = mongoose.model('ESMProduct');
  const ESMSeller = mongoose.model('ESMSeller');
  
  // Update product ratings
  const productReviews = await this.constructor.find({ product: this.product, isHidden: false });
  if (productReviews.length > 0) {
    const avgRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    await ESMProduct.findByIdAndUpdate(this.product, {
      'ratings.average': avgRating,
      'ratings.count': productReviews.length
    });
  }
  
  // Update seller ratings
  const sellerReviews = await this.constructor.find({ seller: this.seller, isHidden: false });
  if (sellerReviews.length > 0) {
    const avgRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length;
    await ESMSeller.findByIdAndUpdate(this.seller, {
      'ratings.average': avgRating,
      'ratings.count': sellerReviews.length
    });
  }
});

const ESMReview = mongoose.model('ESMReview', esmReviewSchema);

module.exports = ESMReview;