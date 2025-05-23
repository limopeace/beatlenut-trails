/**
 * Travel Review Validators
 * Validation rules for travel review data
 */

const { body } = require('express-validator');

/**
 * Validation rules for creating a new review
 */
exports.createReview = [
  body('listingId')
    .not().isEmpty()
    .withMessage('Listing ID is required'),
  
  body('author')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('comment')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review comment must be between 10 and 2000 characters'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  
  body('images.*.caption')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Image caption cannot exceed 100 characters'),
  
  body('travelDate')
    .optional()
    .isISO8601()
    .withMessage('Travel date must be a valid date')
];

/**
 * Validation rules for updating a review
 */
exports.updateReview = [
  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review comment must be between 10 and 2000 characters'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('approved')
    .optional()
    .isBoolean()
    .withMessage('Approved must be a boolean'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  
  body('travelDate')
    .optional()
    .isISO8601()
    .withMessage('Travel date must be a valid date')
];

/**
 * Validation rules for admin response
 */
exports.adminResponse = [
  body('response')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response must be between 10 and 1000 characters')
];