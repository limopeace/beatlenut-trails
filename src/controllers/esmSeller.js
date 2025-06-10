const esmSellerService = require('../services/esmSellerService');
const { BadRequestError } = require('../utils/errors');

/**
 * Controller for ESM Seller operations
 */
class ESMSellerController {
  /**
   * Register a new seller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async register(req, res, next) {
    try {
      // Data transformation is now handled by middleware
      const result = await esmSellerService.registerSeller(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login a seller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }
      
      const result = await esmSellerService.loginSeller(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get seller profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getProfile(req, res, next) {
    try {
      const seller = await esmSellerService.getSellerProfile(req.user.id);
      res.json({ seller });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update seller profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateProfile(req, res, next) {
    try {
      const updatedSeller = await esmSellerService.updateSellerProfile(req.user.id, req.body);
      res.json({ 
        seller: updatedSeller,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change seller password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        throw new BadRequestError('Current password and new password are required');
      }
      
      const result = await esmSellerService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all sellers (admin function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllSellers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: req.query.status,
        category: req.query.category,
        serviceBranch: req.query.serviceBranch,
        isVerified: req.query.isVerified === 'true',
        search: req.query.search
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      
      const result = await esmSellerService.getAllSellers(filters, page, limit, false);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get seller directory (public function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getSellerDirectory(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        category: req.query.category,
        serviceBranch: req.query.serviceBranch,
        search: req.query.search
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      
      const result = await esmSellerService.getAllSellers(filters, page, limit, true);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get seller by ID (public function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getSellerById(req, res, next) {
    try {
      const seller = await esmSellerService.getSellerProfile(req.params.id);
      res.json({ seller });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify seller (admin function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async verifySeller(req, res, next) {
    try {
      const { isVerified, notes } = req.body;
      
      if (isVerified === undefined) {
        throw new BadRequestError('Verification status is required');
      }
      
      const result = await esmSellerService.verifySeller(req.params.id, isVerified, notes);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ESMSellerController();