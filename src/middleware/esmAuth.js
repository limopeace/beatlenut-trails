/**
 * ESM Portal authentication middleware
 */
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authenticate ESM portal request
 * Verifies JWT token and checks if user is ESM seller/buyer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateESM = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new UnauthorizedError('Invalid token. User not found.');
    }

    // Check if user is ESM seller or buyer
    if (!['seller', 'buyer'].includes(user.role)) {
      throw new UnauthorizedError('Access denied. ESM portal is for sellers and buyers only.');
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

/**
 * Authenticate ESM seller
 * Verifies JWT token and checks if user is ESM seller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateESMSeller = async (req, res, next) => {
  try {
    // First authenticate as ESM user
    await authenticateESM(req, res, () => {});
    
    // Check if user is seller
    if (req.user.role !== 'seller') {
      throw new UnauthorizedError('Access denied. This resource is for sellers only.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate ESM buyer
 * Verifies JWT token and checks if user is ESM buyer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateESMBuyer = async (req, res, next) => {
  try {
    // First authenticate as ESM user
    await authenticateESM(req, res, () => {});
    
    // Check if user is buyer
    if (req.user.role !== 'buyer') {
      throw new UnauthorizedError('Access denied. This resource is for buyers only.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateESM,
  authenticateESMSeller,
  authenticateESMBuyer
};