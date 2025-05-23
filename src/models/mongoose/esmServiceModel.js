const mongoose = require('mongoose');

const EsmServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['adventure', 'cultural', 'wellness', 'transportation', 'accommodation', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  availability: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
EsmServiceSchema.index({ provider: 1, approvalStatus: 1 });
EsmServiceSchema.index({ category: 1, price: 1 });
EsmServiceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('EsmService', EsmServiceSchema);