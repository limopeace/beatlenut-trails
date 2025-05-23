const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['seller_registration', 'product_listing', 'document_verification', 'service_listing'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'requesterModel',
    index: true
  },
  requesterModel: {
    type: String,
    required: true,
    enum: ['ESMSeller', 'User']
  },
  requesterName: {
    type: String,
    required: true
  },
  requesterEmail: {
    type: String,
    required: true
  },
  requesterBusinessName: {
    type: String
  },
  requesterProfileImage: {
    type: String
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    enum: ['ESMSeller', 'ESMProduct', 'ESMService', 'Document']
  },
  itemName: {
    type: String
  },
  itemDetails: {
    type: Object
  },
  documents: [{
    id: String,
    type: String,
    name: String,
    path: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  adminNotes: {
    type: String
  },
  requesterNotes: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance
approvalSchema.index({ createdAt: -1 });
approvalSchema.index({ status: 1, type: 1 });
approvalSchema.index({ requesterEmail: 1 });

const Approval = mongoose.model('Approval', approvalSchema);

module.exports = Approval;