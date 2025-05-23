const BikeRentalModel = require('../models/mongoose/bikeRentalModel');

/**
 * Bike Rental Repository
 * Handles database operations for bike rentals
 */
class BikeRentalRepository {
  /**
   * Get all bike rentals with optional filters
   * @param {Object} filters - Optional query filters
   * @returns {Promise<Array>} - List of bike rentals
   */
  async getAllBikeRentals(filters = {}) {
    try {
      const query = BikeRentalModel.find(filters);
      return await query.exec();
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
      return await BikeRentalModel.find({ featured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get bike rental by ID
   * @param {String} id - Bike rental ID
   * @returns {Promise<Object>} - Bike rental document
   */
  async getBikeRentalById(id) {
    try {
      return await BikeRentalModel.findById(id).exec();
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
      const bikeRental = new BikeRentalModel(bikeRentalData);
      return await bikeRental.save();
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
      return await BikeRentalModel.findByIdAndUpdate(
        id,
        bikeRentalData,
        { new: true, runValidators: true }
      ).exec();
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
      return await BikeRentalModel.findByIdAndDelete(id).exec();
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
      return await BikeRentalModel.findByIdAndUpdate(
        id,
        { availability },
        { new: true }
      ).exec();
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
      return await BikeRentalModel.find({ category }).exec();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BikeRentalRepository();