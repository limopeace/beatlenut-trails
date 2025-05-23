const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Conversation Schema
 * Represents a conversation thread between a buyer and a seller
 */
const conversationSchema = new Schema({
  // Unique conversation ID
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Participants in the conversation
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isSeller: {
      type: Boolean,
      default: false
    },
    lastRead: {
      type: Date,
      default: Date.now
    },
    // Reference to ESMSeller if participant is a seller
    sellerProfile: {
      type: Schema.Types.ObjectId,
      ref: 'ESMSeller'
    }
  }],
  
  // Subject or title of the conversation
  subject: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Optional related product/service
  relatedItem: {
    type: Schema.Types.ObjectId,
    ref: 'ESMProduct'
  },
  
  // Type of the related item
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
  
  // Metadata about the latest message
  latestMessage: {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  
  // Total message count in this conversation
  messageCount: {
    type: Number,
    default: 0
  },
  
  // Status of the conversation
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  
  // Administrative flags
  isAdminMonitored: {
    type: Boolean,
    default: false
  },
  
  // Admin notes for monitored conversations
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Create compound indexes for efficient queries
conversationSchema.index({ 'participants.user': 1, updatedAt: -1 });
conversationSchema.index({ 'participants.user': 1, status: 1, updatedAt: -1 });
conversationSchema.index({ 'participants.user': 1, 'participants.isSeller': 1, updatedAt: -1 });
conversationSchema.index({ relatedItem: 1, relatedItemType: 1 });
conversationSchema.index({ relatedOrder: 1 });

// Static method to generate a unique conversation ID for two users
conversationSchema.statics.generateConversationId = function(userId1, userId2) {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
};

// Virtual to calculate unread count for a specific user
conversationSchema.methods.getUnreadCount = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (!participant) return 0;
  
  // We need to make another query to count unread messages
  return mongoose.model('Message').countDocuments({
    conversationId: this.conversationId,
    createdAt: { $gt: participant.lastRead },
    sender: { $ne: userId }
  });
};

// Method to update the latest message data
conversationSchema.methods.updateLatestMessage = function(message) {
  this.latestMessage = {
    sender: message.sender,
    content: message.content.length > 100 
      ? message.content.substring(0, 97) + '...' 
      : message.content,
    timestamp: message.createdAt,
    isRead: false
  };
  this.messageCount += 1;
  return this.save();
};

// Method to mark conversation as read for a specific user
conversationSchema.methods.markAsRead = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.lastRead = new Date();
    if (this.latestMessage.sender.toString() !== userId.toString()) {
      this.latestMessage.isRead = true;
    }
    return this.save();
  }
  return Promise.resolve(this);
};

// Create the model
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;