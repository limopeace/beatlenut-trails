const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const esmSellerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  // Military service details
  serviceBranch: {
    type: String,
    required: true,
    enum: ['army', 'navy', 'airforce', 'coast-guard', 'other']
  },
  rank: {
    type: String,
    required: true,
    trim: true
  },
  serviceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  serviceYears: {
    from: {
      type: Number,
      required: true,
      min: 1947,
      max: new Date().getFullYear()
    },
    to: {
      type: Number,
      required: true,
      min: 1947,
      max: new Date().getFullYear()
    }
  },
  // Seller information
  businessName: {
    type: String,
    trim: true
  },
  sellerType: {
    products: {
      type: Boolean,
      default: false
    },
    services: {
      type: Boolean,
      default: false
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'handicrafts', 
      'food-products', 
      'security-services', 
      'consulting', 
      'training', 
      'agriculture', 
      'technical-services', 
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Account management fields
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String,
    required: true // Path to uploaded document
  },
  verificationNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
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
  // Tracking fields
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

// Hash password before saving
esmSellerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Check if password is correct
esmSellerSchema.methods.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const ESMSeller = mongoose.model('ESMSeller', esmSellerSchema);

module.exports = ESMSeller;