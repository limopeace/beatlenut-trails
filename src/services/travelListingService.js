/**
 * Travel Listing Service
 */
const TravelListing = require('../models/travelListing');
const { NotFoundError, BadRequestError } = require('../utils/errors');

class TravelListingService {
  constructor() {
    this.travelListingModel = new TravelListing();
  }

  /**
   * Create new travel listing
   * @param {Object} listingData - Travel listing data
   * @param {string} userId - User ID of creator
   * @returns {Promise<Object>} Created listing
   */
  async createListing(listingData, userId) {
    // Set the creator
    listingData.createdBy = userId;
    
    // Create the listing
    const listing = await this.travelListingModel.create(listingData);
    
    return listing;
  }

  /**
   * Get all travel listings with optional filters
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Travel listings with pagination
   */
  async getAllListings(query = {}) {
    const options = {
      sort: query.sort || '-createdAt',
      page: query.page || 1,
      limit: query.limit || 10,
      count: true
    };

    // Extract search filters
    const searchCriteria = {
      keyword: query.keyword,
      category: query.category,
      location: query.location,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      startDate: query.startDate,
      endDate: query.endDate,
      sort: query.sort,
      page: query.page,
      limit: query.limit
    };

    // Search with criteria if any exist
    const hasSearchCriteria = Object.values(searchCriteria).some(val => val !== undefined);
    
    if (hasSearchCriteria) {
      return await this.travelListingModel.search(searchCriteria);
    }
    
    // Otherwise get all
    return await this.travelListingModel.getAll({}, options);
  }

  /**
   * Get travel listing by ID
   * @param {string} id - Listing ID
   * @returns {Promise<Object>} Travel listing
   */
  async getListingById(id) {
    const listing = await this.travelListingModel.getById(id);
    
    if (!listing) {
      throw new NotFoundError('Travel listing not found');
    }
    
    return listing;
  }

  /**
   * Get travel listing by slug
   * @param {string} slug - Listing slug
   * @returns {Promise<Object>} Travel listing
   */
  async getListingBySlug(slug) {
    const listing = await this.travelListingModel.getBySlug(slug);
    
    if (!listing) {
      throw new NotFoundError('Travel listing not found');
    }
    
    return listing;
  }

  /**
   * Update travel listing
   * @param {string} id - Listing ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID of updater
   * @returns {Promise<Object>} Updated listing
   */
  async updateListing(id, updateData, userId) {
    // First get the listing to check ownership
    const listing = await this.getListingById(id);
    
    // Only allow the creator to update unless it's an admin (would need role checking here)
    if (listing.createdBy.toString() !== userId) {
      throw new BadRequestError('You are not authorized to update this listing');
    }
    
    // Update the listing
    const updatedListing = await this.travelListingModel.update(id, updateData);
    
    return updatedListing;
  }

  /**
   * Delete travel listing
   * @param {string} id - Listing ID
   * @param {string} userId - User ID of deleter
   * @returns {Promise<Object>} Deleted listing
   */
  async deleteListing(id, userId) {
    // First get the listing to check ownership
    const listing = await this.getListingById(id);
    
    // Only allow the creator to delete unless it's an admin (would need role checking here)
    if (listing.createdBy.toString() !== userId) {
      throw new BadRequestError('You are not authorized to delete this listing');
    }
    
    // Delete the listing (set inactive)
    const deletedListing = await this.travelListingModel.delete(id);
    
    return deletedListing;
  }

  /**
   * Get featured listings
   * @param {number} limit - Number of listings to return
   * @returns {Promise<Array>} Featured listings
   */
  async getFeaturedListings(limit = 4) {
    return await this.travelListingModel.getFeatured(limit);
  }

  /**
   * Check listing availability for dates
   * @param {string} id - Listing ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {number} guests - Number of guests
   * @returns {Promise<Object>} Availability info
   */
  async checkAvailability(id, startDate, endDate, guests) {
    // Get the listing
    const listing = await this.getListingById(id);
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid dates provided');
    }
    
    if (start >= end) {
      throw new BadRequestError('Start date must be before end date');
    }

    // Check if there's an available slot that covers these dates
    const availableSlot = listing.availableDates.find(slot => {
      return slot.startDate <= start && slot.endDate >= end && slot.availability >= guests;
    });

    return {
      available: !!availableSlot,
      availableSlot: availableSlot || null,
      requestedDates: { start, end },
      guests
    };
  }
}

module.exports = TravelListingService;