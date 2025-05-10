/**
 * Authentication middleware
 */
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const AuthService = require('../services/authService');
const authService = new AuthService();

/**
 * Authentication middleware that verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError('Authentication token required'));
    }
    
    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Add user to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Authorization middleware that checks user roles
 * @param {String[]} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};