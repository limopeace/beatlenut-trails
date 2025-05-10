const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example');
const { validate } = require('../middleware/validator');
const { createExampleSchema, getExampleByIdSchema } = require('../validators/example');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
// Get all examples
router.get('/', exampleController.getAll);

// Get example by ID
router.get('/:id', validate(getExampleByIdSchema, 'params'), exampleController.getById);

// Protected routes - require authentication
// Create new example (requires authentication)
router.post('/',
  authenticate,
  validate(createExampleSchema),
  exampleController.create
);

// Example of a route protected by role-based authorization
// Only admins can access this route
router.delete('/:id',
  authenticate,
  authorize(['admin']),
  exampleController.getById // Reusing getById for demo purposes, would normally be a delete controller
);

module.exports = router;