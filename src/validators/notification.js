/**
 * Notification validator
 * Validates notification API requests
 */
const { body, param, query } = require('express-validator');

const notificationValidator = {
  /**
   * Create notification validation
   */
  create: [
    body('type')
      .isIn(['contact', 'booking', 'newsletter', 'bikeRental', 'travelPackage', 'general'])
      .withMessage('Invalid notification type'),
    
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string'),
    
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isString()
      .withMessage('Message must be a string'),
    
    body('source')
      .optional()
      .isIn(['homepage', 'contact', 'bikeRentals', 'services', 'about', 'other'])
      .withMessage('Invalid source'),
    
    body('userData')
      .optional()
      .isObject()
      .withMessage('User data must be an object'),
    
    body('userData.name')
      .optional()
      .isString()
      .withMessage('Name must be a string'),
    
    body('userData.email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address'),
    
    body('userData.phone')
      .optional()
      .isString()
      .withMessage('Phone must be a string'),
    
    body('userData.additionalData')
      .optional()
      .isObject()
      .withMessage('Additional data must be an object'),
    
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority')
  ],
  
  /**
   * Get notification by ID validation
   */
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID')
  ],
  
  /**
   * Mark as read validation
   */
  markAsRead: [
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID')
  ],
  
  /**
   * Mark as archived validation
   */
  markAsArchived: [
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID')
  ],
  
  /**
   * Get all notifications validation
   */
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('type')
      .optional()
      .isIn(['contact', 'booking', 'newsletter', 'bikeRental', 'travelPackage', 'general'])
      .withMessage('Invalid notification type'),
    
    query('status')
      .optional()
      .isIn(['new', 'read', 'archived'])
      .withMessage('Invalid status'),
    
    query('source')
      .optional()
      .isIn(['homepage', 'contact', 'bikeRentals', 'services', 'about', 'other'])
      .withMessage('Invalid source')
  ]
};

module.exports = notificationValidator;