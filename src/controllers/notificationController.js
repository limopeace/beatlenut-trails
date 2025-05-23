/**
 * Notification Controller
 * Handles API requests for admin notifications
 */
const notificationService = require('../services/notificationService');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { validationResult } = require('express-validator');

const notificationController = {
  /**
   * Get all notifications with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllNotifications: async (req, res, next) => {
    try {
      // Parse pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Parse filters
      const filters = {};
      if (req.query.type) {
        filters.type = req.query.type;
      }
      if (req.query.status) {
        filters.status = req.query.status;
      }
      if (req.query.source) {
        filters.source = req.query.source;
      }
      
      const result = await notificationService.getNotifications(filters, page, limit);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get notification by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getNotificationById: async (req, res, next) => {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      
      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  },
  
  /**
   * Create new notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createNotification: async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }
      
      const notification = await notificationService.createNotification(req.body);
      
      res.status(201).json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  },
  
  /**
   * Mark notification as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  markAsRead: async (req, res, next) => {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      
      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  },
  
  /**
   * Mark notification as archived
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  markAsArchived: async (req, res, next) => {
    try {
      const notification = await notificationService.markAsArchived(req.params.id);
      
      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  },
  
  /**
   * Get new notifications count
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getNewNotificationsCount: async (req, res, next) => {
    try {
      const count = await notificationService.getNewNotificationsCount();
      
      res.json({
        status: 'success',
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Mark all notifications as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  markAllAsRead: async (req, res, next) => {
    try {
      const result = await notificationService.markAllAsRead();
      
      res.json({
        status: 'success',
        data: { message: 'All notifications marked as read' }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;