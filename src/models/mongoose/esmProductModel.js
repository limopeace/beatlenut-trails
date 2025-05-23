const mongoose = require('mongoose');

const esmProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ESMSeller',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'handicrafts', 
      'food-products', 
      'clothing-textiles',
      'home-decor', 
      'agriculture-products', 
      'security-services', 
      'consulting-services', 
      'training-services', 
      'technical-services', 
      'other'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['product', 'service'],
    default: 'product'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    unit: {
      type: String,
      default: 'item', // 'item', 'kg', 'service', etc.
    },
    isNegotiable: {
      type: Boolean,
      default: false
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    available: {
      type: Number,
      min: 0,
      default: 1
    },
    isLimited: {
      type: Boolean,
      default: true
    }
  },
  // For services
  availability: {
    inPerson: {
      type: Boolean,
      default: true
    },
    remote: {
      type: Boolean,
      default: false
    },
    locations: [{
      type: String,
      trim: true
    }]
  },
  features: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'rejected'],
    default: 'draft'
  },
  // Admin control
  isApproved: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String
  },
  // Stats and tracking
  views: {
    type: Number,
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
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

// Add text index for search functionality
esmProductSchema.index(
  { 
    name: 'text', 
    description: 'text', 
    shortDescription: 'text',
    'features': 'text'
  },
  {
    weights: {
      name: 10,
      shortDescription: 5,
      features: 3, 
      description: 1
    }
  }
);

const ESMProduct = mongoose.model('ESMProduct', esmProductSchema);

module.exports = ESMProduct;