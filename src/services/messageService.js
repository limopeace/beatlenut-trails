const messageRepository = require('../repositories/messageRepository');
const conversationRepository = require('../repositories/conversationRepository');
const userRepository = require('../repositories/userRepository');
const esmSellerRepository = require('../repositories/esmSellerRepository');
const { NotFoundError, ValidationError, AuthorizationError } = require('../utils/errors');
const notificationService = require('./notificationService');

/**
 * Message Service
 * Handles business logic for messaging
 */
class MessageService {
  /**
   * Send a new message
   * @param {Object} messageData Message data
   * @param {string} senderId User ID of the sender
   * @returns {Promise<Object>} Created message and conversation
   */
  async sendMessage(messageData, senderId) {
    // Validate input
    if (!messageData.content?.trim()) {
      throw new ValidationError('Message content is required');
    }
    
    if (!messageData.recipientId) {
      throw new ValidationError('Recipient is required');
    }
    
    // Check if sender exists
    const sender = await userRepository.getUserById(senderId);
    if (!sender) {
      throw new NotFoundError('Sender not found');
    }
    
    // Check if recipient exists
    const recipient = await userRepository.getUserById(messageData.recipientId);
    if (!recipient) {
      throw new NotFoundError('Recipient not found');
    }
    
    // Check if sender is a seller
    let isSenderSeller = false;
    let senderSellerProfile = null;
    
    try {
      senderSellerProfile = await esmSellerRepository.getSellerByUserId(senderId);
      isSenderSeller = !!senderSellerProfile;
    } catch (error) {
      // Ignore errors, default to not a seller
    }
    
    // Check if recipient is a seller
    let isRecipientSeller = false;
    let recipientSellerProfile = null;
    
    try {
      recipientSellerProfile = await esmSellerRepository.getSellerByUserId(messageData.recipientId);
      isRecipientSeller = !!recipientSellerProfile;
    } catch (error) {
      // Ignore errors, default to not a seller
    }
    
    // Generate conversation ID
    const conversationId = messageRepository.Message.generateConversationId(
      senderId,
      messageData.recipientId
    );
    
    // Check if conversation exists, or create a new one
    let conversation = await conversationRepository.getConversationById(conversationId);
    
    if (!conversation) {
      // Create new conversation
      conversation = await conversationRepository.createConversation({
        conversationId,
        participants: [
          {
            user: senderId,
            isSeller: isSenderSeller,
            sellerProfile: senderSellerProfile?._id
          },
          {
            user: messageData.recipientId,
            isSeller: isRecipientSeller,
            sellerProfile: recipientSellerProfile?._id
          }
        ],
        subject: messageData.subject || '',
        relatedItem: messageData.relatedItemId || null,
        relatedItemType: messageData.relatedItemType || null,
        relatedOrder: messageData.relatedOrderId || null
      });
    }
    
    // Create message
    const message = await messageRepository.createMessage({
      conversationId,
      sender: senderId,
      isSenderSeller,
      recipient: messageData.recipientId,
      isRecipientSeller,
      content: messageData.content.trim(),
      relatedItem: messageData.relatedItemId || null,
      relatedItemType: messageData.relatedItemType || null,
      relatedOrder: messageData.relatedOrderId || null,
      attachments: messageData.attachments || []
    });
    
    // Update conversation with latest message
    await conversationRepository.updateWithLatestMessage(conversationId, message);
    
    // Send notification to recipient
    try {
      await notificationService.createNotification({
        recipient: messageData.recipientId,
        type: 'message',
        title: 'New Message',
        message: `You have received a new message from ${sender.firstName} ${sender.lastName}`,
        data: {
          conversationId,
          messageId: message._id
        },
        priority: 'medium'
      });
    } catch (error) {
      console.error('Failed to send message notification:', error);
      // Don't fail the request if notification fails
    }
    
    return {
      message,
      conversation
    };
  }
  
  /**
   * Get messages by conversation ID
   * @param {string} conversationId Conversation ID
   * @param {string} userId User ID for authorization
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of messages
   */
  async getMessagesByConversation(conversationId, userId, options = {}) {
    // Check if conversation exists
    const conversation = await conversationRepository.getConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }
    
    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      throw new AuthorizationError('Not authorized to view this conversation');
    }
    
    // Get messages
    const messages = await messageRepository.getMessagesByConversation(
      conversationId,
      options
    );
    
    // Mark conversation as read for this user
    await conversationRepository.markAsRead(conversationId, userId);
    await messageRepository.markConversationAsRead(conversationId, userId);
    
    return {
      messages,
      conversation
    };
  }
  
  /**
   * Get conversations for a user
   * @param {string} userId User ID
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of conversations
   */
  async getUserConversations(userId, options = {}) {
    // Check if user exists
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return await conversationRepository.getUserConversations(userId, options);
  }
  
  /**
   * Get conversation between two users
   * @param {string} userId1 First user ID
   * @param {string} userId2 Second user ID
   * @param {string} currentUserId Current user ID for authorization
   * @returns {Promise<Object>} Conversation
   */
  async getConversationBetweenUsers(userId1, userId2, currentUserId) {
    // Check authorization
    if (currentUserId !== userId1 && currentUserId !== userId2) {
      throw new AuthorizationError('Not authorized to view this conversation');
    }
    
    const conversation = await conversationRepository.getConversationBetweenUsers(
      userId1,
      userId2
    );
    
    return conversation;
  }
  
  /**
   * Mark message as read
   * @param {string} messageId Message ID
   * @param {string} userId User ID for authorization
   * @returns {Promise<Object>} Updated message
   */
  async markMessageAsRead(messageId, userId) {
    // Get message
    const message = await messageRepository.getMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    
    // Check if user is the recipient
    if (message.recipient.toString() !== userId.toString()) {
      throw new AuthorizationError('Not authorized to mark this message as read');
    }
    
    // Mark message as read
    return await messageRepository.markMessageAsRead(messageId);
  }
  
  /**
   * Mark conversation as read
   * @param {string} conversationId Conversation ID
   * @param {string} userId User ID for authorization
   * @returns {Promise<Object>} Result
   */
  async markConversationAsRead(conversationId, userId) {
    // Check if conversation exists
    const conversation = await conversationRepository.getConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }
    
    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      throw new AuthorizationError('Not authorized for this conversation');
    }
    
    // Mark conversation as read
    await conversationRepository.markAsRead(conversationId, userId);
    return await messageRepository.markConversationAsRead(conversationId, userId);
  }
  
  /**
   * Archive a conversation
   * @param {string} conversationId Conversation ID
   * @param {string} userId User ID for authorization
   * @returns {Promise<Object>} Updated conversation
   */
  async archiveConversation(conversationId, userId) {
    // Check if conversation exists
    const conversation = await conversationRepository.getConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }
    
    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      throw new AuthorizationError('Not authorized for this conversation');
    }
    
    // Archive conversation
    return await conversationRepository.archiveConversation(conversationId);
  }
  
  /**
   * Get unread conversations count
   * @param {string} userId User ID
   * @returns {Promise<number>} Count of unread conversations
   */
  async getUnreadCount(userId) {
    return await conversationRepository.countUnreadConversations(userId);
  }
  
  /**
   * Search conversations
   * @param {string} userId User ID
   * @param {string} searchTerm Search term
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of matching conversations
   */
  async searchConversations(userId, searchTerm, options = {}) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new ValidationError('Search term must be at least 2 characters');
    }
    
    return await conversationRepository.searchConversations(
      userId,
      searchTerm.trim(),
      options
    );
  }
  
  /**
   * Delete a message (soft delete)
   * @param {string} messageId Message ID
   * @param {string} userId User ID for authorization
   * @returns {Promise<Object>} Updated message
   */
  async deleteMessage(messageId, userId) {
    // Get message
    const message = await messageRepository.getMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== userId.toString()) {
      throw new AuthorizationError('Not authorized to delete this message');
    }
    
    // Delete message
    return await messageRepository.deleteMessage(messageId);
  }
}

module.exports = new MessageService();