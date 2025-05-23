const Message = require('../models/mongoose/messageModel');
const Conversation = require('../models/mongoose/conversationModel');
const { DatabaseError } = require('../utils/errors');

/**
 * Message Repository
 * Handles data access operations for messages
 */
class MessageRepository {
  /**
   * Create a new message
   * @param {Object} messageData Message data
   * @returns {Promise<Object>} Created message
   */
  async createMessage(messageData) {
    try {
      // Generate conversation ID if not provided
      if (!messageData.conversationId) {
        messageData.conversationId = Message.generateConversationId(
          messageData.sender,
          messageData.recipient
        );
      }
      
      const message = new Message(messageData);
      return await message.save();
    } catch (error) {
      throw new DatabaseError(`Error creating message: ${error.message}`, error);
    }
  }

  /**
   * Get message by ID
   * @param {string} messageId Message ID
   * @returns {Promise<Object>} Message object
   */
  async getMessageById(messageId) {
    try {
      return await Message.findById(messageId)
        .populate('sender', 'firstName lastName email profileImage')
        .populate('recipient', 'firstName lastName email profileImage');
    } catch (error) {
      throw new DatabaseError(`Error fetching message: ${error.message}`, error);
    }
  }

  /**
   * Get messages by conversation ID
   * @param {string} conversationId Conversation ID
   * @param {Object} options Query options (limit, skip, sort)
   * @returns {Promise<Array>} Array of message objects
   */
  async getMessagesByConversation(conversationId, options = {}) {
    try {
      const query = Message.find({ conversationId, status: { $ne: 'deleted' } })
        .populate('sender', 'firstName lastName email profileImage')
        .populate('recipient', 'firstName lastName email profileImage')
        .populate('relatedItem', 'name price images');
      
      // Apply pagination
      if (options.limit) {
        query.limit(Number(options.limit));
      }
      if (options.skip) {
        query.skip(Number(options.skip));
      }
      
      // Apply sorting (default to newest first)
      const sortField = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder || 'desc';
      query.sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      
      return await query.exec();
    } catch (error) {
      throw new DatabaseError(`Error fetching conversation messages: ${error.message}`, error);
    }
  }

  /**
   * Get messages between two users
   * @param {string} userId1 First user ID
   * @param {string} userId2 Second user ID
   * @param {Object} options Query options (limit, skip, sort)
   * @returns {Promise<Array>} Array of message objects
   */
  async getMessagesBetweenUsers(userId1, userId2, options = {}) {
    try {
      const conversationId = Message.generateConversationId(userId1, userId2);
      return await this.getMessagesByConversation(conversationId, options);
    } catch (error) {
      throw new DatabaseError(`Error fetching messages between users: ${error.message}`, error);
    }
  }

  /**
   * Get unread messages for a user
   * @param {string} userId User ID
   * @param {Object} options Query options (limit, skip)
   * @returns {Promise<Array>} Array of unread message objects
   */
  async getUnreadMessages(userId, options = {}) {
    try {
      const query = Message.find({
        recipient: userId,
        isRead: false,
        status: 'active'
      })
        .populate('sender', 'firstName lastName email profileImage')
        .populate('relatedItem', 'name price images');
      
      // Apply pagination
      if (options.limit) {
        query.limit(Number(options.limit));
      }
      if (options.skip) {
        query.skip(Number(options.skip));
      }
      
      // Sort by creation date (newest first)
      query.sort({ createdAt: -1 });
      
      return await query.exec();
    } catch (error) {
      throw new DatabaseError(`Error fetching unread messages: ${error.message}`, error);
    }
  }

  /**
   * Mark message as read
   * @param {string} messageId Message ID
   * @returns {Promise<Object>} Updated message
   */
  async markMessageAsRead(messageId) {
    try {
      return await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError(`Error marking message as read: ${error.message}`, error);
    }
  }

  /**
   * Mark all messages in a conversation as read for a user
   * @param {string} conversationId Conversation ID
   * @param {string} userId User ID (recipient)
   * @returns {Promise<Object>} Result of update operation
   */
  async markConversationAsRead(conversationId, userId) {
    try {
      const result = await Message.updateMany(
        {
          conversationId,
          recipient: userId,
          isRead: false
        },
        { isRead: true }
      );
      
      // Update the conversation lastRead timestamp for this user
      await Conversation.findOneAndUpdate(
        { 
          conversationId,
          'participants.user': userId
        },
        {
          $set: { 'participants.$.lastRead': new Date() }
        }
      );
      
      return result;
    } catch (error) {
      throw new DatabaseError(`Error marking conversation as read: ${error.message}`, error);
    }
  }

  /**
   * Update message status
   * @param {string} messageId Message ID
   * @param {string} status New status
   * @returns {Promise<Object>} Updated message
   */
  async updateMessageStatus(messageId, status) {
    try {
      return await Message.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError(`Error updating message status: ${error.message}`, error);
    }
  }

  /**
   * Count unread messages for a user
   * @param {string} userId User ID
   * @returns {Promise<number>} Count of unread messages
   */
  async countUnreadMessages(userId) {
    try {
      return await Message.countDocuments({
        recipient: userId,
        isRead: false,
        status: 'active'
      });
    } catch (error) {
      throw new DatabaseError(`Error counting unread messages: ${error.message}`, error);
    }
  }

  /**
   * Delete a message (soft delete)
   * @param {string} messageId Message ID
   * @returns {Promise<Object>} Updated message
   */
  async deleteMessage(messageId) {
    try {
      return await Message.findByIdAndUpdate(
        messageId,
        { status: 'deleted' },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError(`Error deleting message: ${error.message}`, error);
    }
  }
}

module.exports = new MessageRepository();