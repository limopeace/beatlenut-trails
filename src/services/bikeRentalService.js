const bikeRentalRepository = require('../repositories/bikeRentalRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

/**
 * Bike Rental Service
 * Handles business logic for bike rentals
 */
class BikeRentalService {
  /**
   * Get all bike rentals with optional filtering
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of bike rentals
   */
  async getAllBikeRentals(filters = {}) {
    try {
      return await bikeRentalRepository.getAllBikeRentals(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured bike rentals
   * @param {Number} limit - Maximum number of rentals to return
   * @returns {Promise<Array>} - List of featured bike rentals
   */
  async getFeaturedBikeRentals(limit = 3) {
    try {
      return await bikeRentalRepository.getFeaturedBikeRentals(limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get bike rental by ID
   * @param {String} id - Bike rental ID
   * @returns {Promise<Object>} - Bike rental object
   */
  async getBikeRentalById(id) {
    try {
      const bikeRental = await bikeRentalRepository.getBikeRentalById(id);
      if (!bikeRental) {
        throw new NotFoundError('Bike rental not found');
      }
      return bikeRental;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new bike rental
   * @param {Object} bikeRentalData - Bike rental data
   * @returns {Promise<Object>} - Created bike rental
   */
  async createBikeRental(bikeRentalData) {
    try {
      // Validate required fields
      this._validateBikeRentalData(bikeRentalData);
      
      return await bikeRentalRepository.createBikeRental(bikeRentalData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update bike rental
   * @param {String} id - Bike rental ID
   * @param {Object} bikeRentalData - Updated bike rental data
   * @returns {Promise<Object>} - Updated bike rental
   */
  async updateBikeRental(id, bikeRentalData) {
    try {
      // Check if bike rental exists
      const existingBikeRental = await this.getBikeRentalById(id);
      if (!existingBikeRental) {
        throw new NotFoundError('Bike rental not found');
      }

      return await bikeRentalRepository.updateBikeRental(id, bikeRentalData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete bike rental
   * @param {String} id - Bike rental ID
   * @returns {Promise<Object>} - Deleted bike rental
   */
  async deleteBikeRental(id) {
    try {
      // Check if bike rental exists
      const existingBikeRental = await this.getBikeRentalById(id);
      if (!existingBikeRental) {
        throw new NotFoundError('Bike rental not found');
      }

      return await bikeRentalRepository.deleteBikeRental(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update availability status
   * @param {String} id - Bike rental ID
   * @param {Boolean} availability - New availability status
   * @returns {Promise<Object>} - Updated bike rental
   */
  async updateAvailability(id, availability) {
    try {
      // Check if bike rental exists
      const existingBikeRental = await this.getBikeRentalById(id);
      if (!existingBikeRental) {
        throw new NotFoundError('Bike rental not found');
      }

      if (typeof availability !== 'boolean') {
        throw new ValidationError('Availability must be a boolean value');
      }

      return await bikeRentalRepository.updateAvailability(id, availability);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get bike rentals by category
   * @param {String} category - Category to filter by
   * @returns {Promise<Array>} - List of bike rentals in the category
   */
  async getBikeRentalsByCategory(category) {
    try {
      return await bikeRentalRepository.getBikeRentalsByCategory(category);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate bike rental data
   * @param {Object} data - Bike rental data to validate
   * @throws {ValidationError} If validation fails
   */
  _validateBikeRentalData(data) {
    // Check required fields
    if (!data.name || !data.description || !data.pricePerDay || !data.imageSrc) {
      throw new ValidationError('Missing required bike rental fields');
    }

    // Validate price
    if (typeof data.pricePerDay !== 'number' || data.pricePerDay <= 0) {
      throw new ValidationError('Price per day must be a positive number');
    }

    // Validate category if provided
    if (data.category && !['touring', 'adventure', 'sport', 'cruiser', 'other'].includes(data.category)) {
      throw new ValidationError('Invalid category value');
    }
  }
}

module.exports = new BikeRentalService();