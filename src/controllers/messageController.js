const messageService = require('../services/messageService');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * Message Controller
 * Handles message-related API requests
 */
class MessageController {
  /**
   * Send a new message
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async sendMessage(req, res, next) {
    try {
      const messageData = req.body;
      const senderId = req.user.id;
      const files = req.files || [];
      
      // Process uploaded files
      const attachments = files.map(file => ({
        url: `/api/uploads/messages/${file.filename}`,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
      }));
      
      // Add attachments to message data
      messageData.attachments = attachments;
      
      const result = await messageService.sendMessage(messageData, senderId);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      // Clean up uploaded files if there's an error
      if (req.files) {
        const { cleanupFiles } = require('../middleware/fileUpload');
        cleanupFiles(req.files);
      }
      next(error);
    }
  }
  
  /**
   * Get messages by conversation ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getMessagesByConversation(req, res, next) {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user.id;
      
      const options = {
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };
      
      const result = await messageService.getMessagesByConversation(
        conversationId,
        userId,
        options
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get conversations for current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUserConversations(req, res, next) {
    try {
      const userId = req.user.id;
      
      const options = {
        limit: parseInt(req.query.limit) || 20,
        skip: parseInt(req.query.skip) || 0,
        sortBy: req.query.sortBy || 'updatedAt',
        sortOrder: req.query.sortOrder || 'desc',
        status: req.query.status || 'active',
        unreadOnly: req.query.unreadOnly === 'true'
      };
      
      const conversations = await messageService.getUserConversations(userId, options);
      
      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get conversation between two users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getConversationBetweenUsers(req, res, next) {
    try {
      const userId1 = req.params.userId1;
      const userId2 = req.params.userId2;
      const currentUserId = req.user.id;
      
      const conversation = await messageService.getConversationBetweenUsers(
        userId1,
        userId2,
        currentUserId
      );
      
      res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark message as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async markMessageAsRead(req, res, next) {
    try {
      const messageId = req.params.messageId;
      const userId = req.user.id;
      
      const message = await messageService.markMessageAsRead(messageId, userId);
      
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark conversation as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async markConversationAsRead(req, res, next) {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user.id;
      
      const result = await messageService.markConversationAsRead(conversationId, userId);
      
      res.status(200).json({
        success: true,
        data: {
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Archive a conversation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async archiveConversation(req, res, next) {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user.id;
      
      const conversation = await messageService.archiveConversation(conversationId, userId);
      
      res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get unread conversations count
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;
      
      const count = await messageService.getUnreadCount(userId);
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Search conversations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async searchConversations(req, res, next) {
    try {
      const userId = req.user.id;
      const searchTerm = req.query.q;
      
      if (!searchTerm) {
        throw new ValidationError('Search term is required');
      }
      
      const options = {
        limit: parseInt(req.query.limit) || 20,
        skip: parseInt(req.query.skip) || 0
      };
      
      const conversations = await messageService.searchConversations(
        userId,
        searchTerm,
        options
      );
      
      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a message
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteMessage(req, res, next) {
    try {
      const messageId = req.params.messageId;
      const userId = req.user.id;
      
      const message = await messageService.deleteMessage(messageId, userId);
      
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();