const bikeRentalService = require('../services/bikeRentalService');
const { validationResult } = require('express-validator');
const { NotFoundError, ValidationError } = require('../utils/errors');

/**
 * Bike Rental Controller
 * Handles API requests for bike rentals
 */
class BikeRentalController {
  /**
   * Get all bike rentals with optional filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllBikeRentals(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract filters from query parameters
      const filters = {};
      if (req.query.category) filters.category = req.query.category;
      if (req.query.featured !== undefined) filters.featured = req.query.featured === 'true';
      if (req.query.availability !== undefined) filters.availability = req.query.availability === 'true';

      const bikeRentals = await bikeRentalService.getAllBikeRentals(filters);
      return res.json(bikeRentals);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get featured bike rentals
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getFeaturedBikeRentals(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get limit from query or use default
      const limit = req.query.limit ? parseInt(req.query.limit) : 3;
      
      const bikeRentals = await bikeRentalService.getFeaturedBikeRentals(limit);
      return res.json(bikeRentals);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get bike rental by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getBikeRentalById(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bikeRental = await bikeRentalService.getBikeRentalById(req.params.id);
      return res.json(bikeRental);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Create new bike rental
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createBikeRental(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bikeRental = await bikeRentalService.createBikeRental(req.body);
      return res.status(201).json(bikeRental);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Update bike rental
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateBikeRental(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bikeRental = await bikeRentalService.updateBikeRental(req.params.id, req.body);
      return res.json(bikeRental);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Delete bike rental
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteBikeRental(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await bikeRentalService.deleteBikeRental(req.params.id);
      return res.status(204).end();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Update availability status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateAvailability(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bikeRental = await bikeRentalService.updateAvailability(
        req.params.id,
        req.body.availability
      );
      return res.json(bikeRental);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Get bike rentals by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getBikeRentalsByCategory(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bikeRentals = await bikeRentalService.getBikeRentalsByCategory(req.params.category);
      return res.json(bikeRentals);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BikeRentalController();