const { body, param, query } = require('express-validator');

/**
 * Bike Rental Validator
 * Validates bike rental API requests
 */
const bikeRentalValidator = {
  /**
   * Create bike rental validation
   */
  create: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string')
      .trim(),
    
    body('description')
      .notEmpty().withMessage('Description is required')
      .isString().withMessage('Description must be a string')
      .trim(),
    
    body('pricePerDay')
      .notEmpty().withMessage('Price per day is required')
      .isNumeric().withMessage('Price per day must be a number')
      .custom(value => value > 0).withMessage('Price per day must be greater than 0'),
    
    body('imageSrc')
      .notEmpty().withMessage('Image source is required')
      .isString().withMessage('Image source must be a string')
      .trim(),
    
    body('features')
      .optional()
      .isArray().withMessage('Features must be an array'),
    
    body('specifications')
      .optional()
      .isObject().withMessage('Specifications must be an object'),
    
    body('availability')
      .optional()
      .isBoolean().withMessage('Availability must be a boolean'),
    
    body('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .isIn(['touring', 'adventure', 'sport', 'cruiser', 'other']).withMessage('Invalid category'),
    
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean')
  ],

  /**
   * Update bike rental validation
   */
  update: [
    param('id')
      .notEmpty().withMessage('Bike rental ID is required')
      .isMongoId().withMessage('Invalid bike rental ID'),
    
    body('name')
      .optional()
      .isString().withMessage('Name must be a string')
      .trim(),
    
    body('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .trim(),
    
    body('pricePerDay')
      .optional()
      .isNumeric().withMessage('Price per day must be a number')
      .custom(value => value > 0).withMessage('Price per day must be greater than 0'),
    
    body('imageSrc')
      .optional()
      .isString().withMessage('Image source must be a string')
      .trim(),
    
    body('features')
      .optional()
      .isArray().withMessage('Features must be an array'),
    
    body('specifications')
      .optional()
      .isObject().withMessage('Specifications must be an object'),
    
    body('availability')
      .optional()
      .isBoolean().withMessage('Availability must be a boolean'),
    
    body('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .isIn(['touring', 'adventure', 'sport', 'cruiser', 'other']).withMessage('Invalid category'),
    
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean')
  ],

  /**
   * Get bike rental by ID validation
   */
  getById: [
    param('id')
      .notEmpty().withMessage('Bike rental ID is required')
      .isMongoId().withMessage('Invalid bike rental ID')
  ],

  /**
   * Delete bike rental validation
   */
  delete: [
    param('id')
      .notEmpty().withMessage('Bike rental ID is required')
      .isMongoId().withMessage('Invalid bike rental ID')
  ],

  /**
   * Update availability validation
   */
  updateAvailability: [
    param('id')
      .notEmpty().withMessage('Bike rental ID is required')
      .isMongoId().withMessage('Invalid bike rental ID'),
    
    body('availability')
      .notEmpty().withMessage('Availability is required')
      .isBoolean().withMessage('Availability must be a boolean')
  ],

  /**
   * Filter bike rentals validation
   */
  filter: [
    query('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .isIn(['touring', 'adventure', 'sport', 'cruiser', 'other']).withMessage('Invalid category'),
    
    query('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    
    query('availability')
      .optional()
      .isBoolean().withMessage('Availability must be a boolean'),
    
    query('limit')
      .optional()
      .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
  ]
};

module.exports = bikeRentalValidator;