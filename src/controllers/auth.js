/**
 * Authentication controller
 */
const authService = require('../services/authService');

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
        success: true,
        data: result,
        message: 'User registered successfully'
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
        success: true,
        data: result,
        message: 'Login successful'
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
      success: true,
      data: {
        user: req.user
      },
      message: 'Profile fetched successfully'
    });
  },

  /**
   * ESM Portal login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  esmLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.esmLogin(email, password);
      
      res.json({
        success: true,
        data: result,
        message: 'ESM login successful'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ESM Portal registration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  esmRegister: async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await authService.esmRegister(userData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'ESM registration successful'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ESM Portal logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  esmLogout: async (req, res, next) => {
    try {
      // Client-side logout is handled by clearing cookies/storage
      // Server-side can implement token blacklisting if needed
      
      res.json({
        success: true,
        message: 'ESM logout successful'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current ESM user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getEsmUser: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await authService.getEsmUser(userId);
      
      res.json({
        success: true,
        data: user,
        message: 'ESM user fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update ESM profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateEsmProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const updatedUser = await authService.updateEsmProfile(userId, updateData);
      
      res.json({
        success: true,
        data: updatedUser,
        message: 'ESM profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  adminLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      
      res.json({
        success: true,
        data: result,
        message: 'Admin login successful'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify admin token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  verifyAdminToken: async (req, res, next) => {
    try {
      // User is already authenticated via middleware, just check if admin
      if (req.user.role !== 'admin') {
        const error = new Error('Access denied. Admin role required.');
        error.statusCode = 403;
        throw error;
      }
      
      res.json({
        success: true,
        user: req.user,
        message: 'Token is valid'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;