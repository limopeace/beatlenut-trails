/**
 * Travel Listing Controller
 */
const TravelListingService = require('../services/travelListingService');
const travelListingService = new TravelListingService();

const travelListingController = {
  /**
   * Get all travel listings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllListings: async (req, res, next) => {
    try {
      const listings = await travelListingService.getAllListings(req.query);
      
      res.json({
        status: 'success',
        data: listings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get travel listing by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getListingById: async (req, res, next) => {
    try {
      const listing = await travelListingService.getListingById(req.params.id);
      
      res.json({
        status: 'success',
        data: {
          listing
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get travel listing by slug
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getListingBySlug: async (req, res, next) => {
    try {
      const listing = await travelListingService.getListingBySlug(req.params.slug);
      
      res.json({
        status: 'success',
        data: {
          listing
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new travel listing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createListing: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const listing = await travelListingService.createListing(req.body, userId);
      
      res.status(201).json({
        status: 'success',
        data: {
          listing
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update travel listing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateListing: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const listing = await travelListingService.updateListing(req.params.id, req.body, userId);
      
      res.json({
        status: 'success',
        data: {
          listing
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete travel listing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteListing: async (req, res, next) => {
    try {
      const userId = req.user.id;
      await travelListingService.deleteListing(req.params.id, userId);
      
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get featured listings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getFeaturedListings: async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 4;
      const listings = await travelListingService.getFeaturedListings(limit);
      
      res.json({
        status: 'success',
        data: {
          listings
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check listing availability
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  checkAvailability: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { startDate, endDate, guests } = req.body;
      
      const availability = await travelListingService.checkAvailability(
        id, startDate, endDate, guests
      );
      
      res.json({
        status: 'success',
        data: {
          availability
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = travelListingController;