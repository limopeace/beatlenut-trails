const Conversation = require('../models/mongoose/conversationModel');
const Message = require('../models/mongoose/messageModel');
const { DatabaseError } = require('../utils/errors');

/**
 * Conversation Repository
 * Handles data access operations for conversations
 */
class ConversationRepository {
  /**
   * Create a new conversation
   * @param {Object} conversationData Conversation data
   * @returns {Promise<Object>} Created conversation
   */
  async createConversation(conversationData) {
    try {
      // Generate conversation ID if not provided
      if (!conversationData.conversationId && conversationData.participants?.length >= 2) {
        const user1 = conversationData.participants[0].user;
        const user2 = conversationData.participants[1].user;
        conversationData.conversationId = Conversation.generateConversationId(user1, user2);
      }
      
      // Check if conversation already exists
      const existingConversation = await Conversation.findOne({
        conversationId: conversationData.conversationId
      });
      
      if (existingConversation) {
        return existingConversation;
      }
      
      const conversation = new Conversation(conversationData);
      return await conversation.save();
    } catch (error) {
      throw new DatabaseError(`Error creating conversation: ${error.message}`, error);
    }
  }

  /**
   * Get a conversation by ID
   * @param {string} conversationId Conversation ID
   * @returns {Promise<Object>} Conversation object
   */
  async getConversationById(conversationId) {
    try {
      return await Conversation.findOne({ conversationId })
        .populate('participants.user', 'firstName lastName email profileImage')
        .populate('participants.sellerProfile', 'businessName')
        .populate('relatedItem', 'name price images')
        .populate('relatedOrder', 'orderNumber total status')
        .populate('latestMessage.sender', 'firstName lastName');
    } catch (error) {
      throw new DatabaseError(`Error fetching conversation: ${error.message}`, error);
    }
  }

  /**
   * Get all conversations for a user
   * @param {string} userId User ID
   * @param {Object} options Query options (limit, skip, filter)
   * @returns {Promise<Array>} Array of conversation objects
   */
  async getUserConversations(userId, options = {}) {
    try {
      let query = {
        'participants.user': userId,
        status: options.status || 'active'
      };
      
      // Add additional filters
      if (options.unreadOnly) {
        query['latestMessage.isRead'] = false;
        query['latestMessage.sender'] = { $ne: userId };
      }
      
      if (options.withSellers) {
        query['participants.isSeller'] = true;
      }
      
      const conversationsQuery = Conversation.find(query)
        .populate('participants.user', 'firstName lastName email profileImage')
        .populate('participants.sellerProfile', 'businessName logoImage')
        .populate('relatedItem', 'name price images')
        .populate('latestMessage.sender', 'firstName lastName');
      
      // Apply sorting (default to most recently updated)
      const sortField = options.sortBy || 'updatedAt';
      const sortOrder = options.sortOrder || 'desc';
      conversationsQuery.sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      
      // Apply pagination
      if (options.limit) {
        conversationsQuery.limit(Number(options.limit));
      }
      if (options.skip) {
        conversationsQuery.skip(Number(options.skip));
      }
      
      const conversations = await conversationsQuery.exec();
      
      return conversations;
    } catch (error) {
      throw new DatabaseError(`Error fetching user conversations: ${error.message}`, error);
    }
  }

  /**
   * Get conversation between two users
   * @param {string} userId1 First user ID
   * @param {string} userId2 Second user ID
   * @returns {Promise<Object>} Conversation object
   */
  async getConversationBetweenUsers(userId1, userId2) {
    try {
      const conversationId = Conversation.generateConversationId(userId1, userId2);
      return await this.getConversationById(conversationId);
    } catch (error) {
      throw new DatabaseError(`Error fetching conversation between users: ${error.message}`, error);
    }
  }

  /**
   * Update conversation with the latest message
   * @param {string} conversationId Conversation ID
   * @param {Object} messageData Latest message data
   * @returns {Promise<Object>} Updated conversation
   */
  async updateWithLatestMessage(conversationId, messageData) {
    try {
      const conversation = await Conversation.findOne({ conversationId });
      
      if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }
      
      // Update latest message data and increment count
      conversation.latestMessage = {
        sender: messageData.sender,
        content: messageData.content.length > 100 
          ? messageData.content.substring(0, 97) + '...' 
          : messageData.content,
        timestamp: messageData.createdAt || new Date(),
        isRead: false
      };
      
      conversation.messageCount = (conversation.messageCount || 0) + 1;
      
      // Set status back to active in case it was archived
      if (conversation.status === 'archived') {
        conversation.status = 'active';
      }
      
      // Save and return updated conversation
      return await conversation.save();
    } catch (error) {
      throw new DatabaseError(`Error updating conversation: ${error.message}`, error);
    }
  }

  /**
   * Mark conversation as read for a user
   * @param {string} conversationId Conversation ID
   * @param {string} userId User ID
   * @returns {Promise<Object>} Updated conversation
   */
  async markAsRead(conversationId, userId) {
    try {
      const conversation = await Conversation.findOne({ conversationId });
      
      if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }
      
      // Update lastRead timestamp for the user
      const participantIndex = conversation.participants.findIndex(
        p => p.user.toString() === userId.toString()
      );
      
      if (participantIndex === -1) {
        throw new Error(`User not found in conversation: ${userId}`);
      }
      
      conversation.participants[participantIndex].lastRead = new Date();
      
      // If the latest message is to this user and from someone else, mark it as read
      if (
        conversation.latestMessage &&
        conversation.latestMessage.sender &&
        conversation.latestMessage.sender.toString() !== userId.toString()
      ) {
        conversation.latestMessage.isRead = true;
      }
      
      return await conversation.save();
    } catch (error) {
      throw new DatabaseError(`Error marking conversation as read: ${error.message}`, error);
    }
  }

  /**
   * Update conversation status
   * @param {string} conversationId Conversation ID
   * @param {string} status New status
   * @returns {Promise<Object>} Updated conversation
   */
  async updateStatus(conversationId, status) {
    try {
      return await Conversation.findOneAndUpdate(
        { conversationId },
        { status },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError(`Error updating conversation status: ${error.message}`, error);
    }
  }

  /**
   * Archive a conversation
   * @param {string} conversationId Conversation ID
   * @returns {Promise<Object>} Updated conversation
   */
  async archiveConversation(conversationId) {
    try {
      return await this.updateStatus(conversationId, 'archived');
    } catch (error) {
      throw new DatabaseError(`Error archiving conversation: ${error.message}`, error);
    }
  }

  /**
   * Delete a conversation (soft delete)
   * @param {string} conversationId Conversation ID
   * @returns {Promise<Object>} Updated conversation
   */
  async deleteConversation(conversationId) {
    try {
      return await this.updateStatus(conversationId, 'deleted');
    } catch (error) {
      throw new DatabaseError(`Error deleting conversation: ${error.message}`, error);
    }
  }

  /**
   * Count unread conversations for a user
   * @param {string} userId User ID
   * @returns {Promise<number>} Count of conversations with unread messages
   */
  async countUnreadConversations(userId) {
    try {
      return await Conversation.countDocuments({
        'participants.user': userId,
        status: 'active',
        'latestMessage.isRead': false,
        'latestMessage.sender': { $ne: userId }
      });
    } catch (error) {
      throw new DatabaseError(`Error counting unread conversations: ${error.message}`, error);
    }
  }

  /**
   * Search conversations by content or participants
   * @param {string} userId User ID
   * @param {string} searchTerm Search term
   * @param {Object} options Query options
   * @returns {Promise<Array>} Array of matching conversations
   */
  async searchConversations(userId, searchTerm, options = {}) {
    try {
      // First, get user IDs with names matching search term
      const userModel = require('../models/mongoose/userModel');
      const matchingUsers = await userModel.find({
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      }).select('_id');
      
      const matchingUserIds = matchingUsers.map(user => user._id);
      
      // Find conversations where this user is a participant and either:
      // 1. The other participant matches the search term, or
      // 2. The latest message content contains the search term
      const query = {
        'participants.user': userId,
        status: 'active',
        $or: [
          { 'participants.user': { $in: matchingUserIds } },
          { 'latestMessage.content': { $regex: searchTerm, $options: 'i' } }
        ]
      };
      
      const searchQuery = Conversation.find(query)
        .populate('participants.user', 'firstName lastName email profileImage')
        .populate('participants.sellerProfile', 'businessName logoImage')
        .populate('latestMessage.sender', 'firstName lastName');
      
      // Apply sorting (default to most recently updated)
      const sortField = options.sortBy || 'updatedAt';
      const sortOrder = options.sortOrder || 'desc';
      searchQuery.sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      
      // Apply pagination
      if (options.limit) {
        searchQuery.limit(Number(options.limit));
      }
      if (options.skip) {
        searchQuery.skip(Number(options.skip));
      }
      
      return await searchQuery.exec();
    } catch (error) {
      throw new DatabaseError(`Error searching conversations: ${error.message}`, error);
    }
  }
}

module.exports = new ConversationRepository();