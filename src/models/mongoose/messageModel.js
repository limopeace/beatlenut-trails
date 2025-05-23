const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Message Schema
 * Represents a message between a buyer and a seller
 */
const messageSchema = new Schema({
  // Conversation ID groups messages between the same parties
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Sender can be either a regular user (buyer) or a seller
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Indicates if the sender is a seller
  isSenderSeller: {
    type: Boolean,
    default: false
  },
  
  // Recipient can be either a regular user (buyer) or a seller
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Indicates if the recipient is a seller
  isRecipientSeller: {
    type: Boolean,
    default: false
  },
  
  // The actual message content
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  
  // Optional related product/service reference
  relatedItem: {
    type: Schema.Types.ObjectId,
    ref: 'ESMProduct'
  },
  
  // Type of the related item (product or service)
  relatedItemType: {
    type: String,
    enum: ['product', 'service', null],
    default: null
  },
  
  // Optional related order
  relatedOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  
  // Additional attachments (file URLs)
  attachments: [{
    url: String,
    fileName: String,
    fileType: String,
    fileSize: Number
  }],
  
  // Status for administrative purposes
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted', 'flagged'],
    default: 'active'
  },
  
  // For administrator actions
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Create compound indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

// Static method to generate a unique conversation ID for two users
messageSchema.statics.generateConversationId = function(userId1, userId2) {
  // Sort IDs to ensure consistency regardless of which user is sender/recipient
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
};

// Virtual for checking if the message has attachments
messageSchema.virtual('hasAttachments').get(function() {
  return this.attachments.length > 0;
});

// Create the model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;