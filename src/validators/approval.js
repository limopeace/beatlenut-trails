const { body, param } = require('express-validator');

const approvalValidator = {
  // Validate seller approval creation
  createSellerApproval: [
    body('sellerId')
      .isMongoId()
      .withMessage('Valid seller ID is required')
  ],
  
  // Validate product approval creation
  createProductApproval: [
    body('productId')
      .isMongoId()
      .withMessage('Valid product ID is required')
  ],
  
  // Validate service approval creation
  createServiceApproval: [
    body('serviceId')
      .isMongoId()
      .withMessage('Valid service ID is required')
  ],
  
  // Validate approval ID
  validateApprovalId: [
    param('id')
      .isMongoId()
      .withMessage('Valid approval ID is required')
  ],
  
  // Validate approval
  approveRequest: [
    param('id')
      .isMongoId()
      .withMessage('Valid approval ID is required'),
    body('notes')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],
  
  // Validate rejection
  rejectRequest: [
    param('id')
      .isMongoId()
      .withMessage('Valid approval ID is required'),
    body('reason')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Rejection reason is required')
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters'),
    body('notes')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],
  
  // Validate document status update
  updateDocumentStatus: [
    param('id')
      .isMongoId()
      .withMessage('Valid approval ID is required'),
    param('documentId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Valid document ID is required'),
    body('status')
      .isString()
      .trim()
      .isIn(['pending', 'verified', 'rejected'])
      .withMessage('Status must be one of: pending, verified, rejected')
  ]
};

module.exports = approvalValidator;