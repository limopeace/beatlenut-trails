/**
 * Authentication middleware
 */
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const authService = require('../services/authService');

/**
 * Authentication middleware that verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
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

    // Get user from database
    const user = await authService.getUserById(decoded.id);
    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return next(new UnauthorizedError('User changed password. Please login again'));
    }

    // Add user to request object
    req.user = user;

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

    // Convert string to array if needed
    const roleArray = typeof roles === 'string' ? [roles] : roles;

    if (roleArray.length && !roleArray.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};