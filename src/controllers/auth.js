/**
 * Authentication controller
 */
const AuthService = require('../services/authService');
const authService = new AuthService();

const authController = {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProfile: (req, res) => {
    res.json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  }
};

module.exports = authController;