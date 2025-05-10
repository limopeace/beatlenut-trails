/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate } = require('../middleware/validator');
const { registerSchema, loginSchema } = require('../validators/auth');
const { authenticate } = require('../middleware/auth');

// Register a new user
router.post('/register', validate(registerSchema), authController.register);

// Login user
router.post('/login', validate(loginSchema), authController.login);

// Get current user profile (protected route)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;