/**
 * TravelListing model interface
 */
const TravelListingModel = require('./mongoose/travelListingModel');

class TravelListing {
  /**
   * Create a new travel listing
   * @param {Object} listingData - Travel listing data
   * @returns {Promise<Object>} Created listing
   */
  async create(listingData) {
    return await TravelListingModel.create(listingData);
  }

  /**
   * Get all travel listings with optional filters
   * @param {Object} filters - Optional filters
   * @param {Object} options - Query options (sort, limit, etc.)
   * @returns {Promise<Array>} Array of travel listings
   */
  async getAll(filters = {}, options = {}) {
    const query = TravelListingModel.find(filters);

    // Apply sorting
    if (options.sort) {
      query.sort(options.sort);
    } else {
      query.sort('-createdAt');
    }

    // Apply pagination
    if (options.page && options.limit) {
      const page = parseInt(options.page, 10) || 1;
      const limit = parseInt(options.limit, 10) || 10;
      const skip = (page - 1) * limit;
      
      query.skip(skip).limit(limit);
    } else if (options.limit) {
      query.limit(parseInt(options.limit, 10));
    }

    // Get total count for pagination if requested
    let total;
    if (options.count) {
      total = await TravelListingModel.countDocuments(filters);
    }

    // Execute query
    const listings = await query;

    // Return with pagination data if requested
    if (options.count) {
      return {
        data: listings,
        total,
        page: options.page ? parseInt(options.page, 10) : 1,
        limit: options.limit ? parseInt(options.limit, 10) : listings.length,
        pages: options.limit ? Math.ceil(total / parseInt(options.limit, 10)) : 1
      };
    }

    return listings;
  }

  /**
   * Get travel listing by ID
   * @param {string} id - Listing ID
   * @returns {Promise<Object>} Travel listing
   */
  async getById(id) {
    return await TravelListingModel.findById(id);
  }

  /**
   * Get travel listing by slug
   * @param {string} slug - Listing slug
   * @returns {Promise<Object>} Travel listing
   */
  async getBySlug(slug) {
    return await TravelListingModel.findOne({ slug });
  }

  /**
   * Update travel listing
   * @param {string} id - Listing ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated listing
   */
  async update(id, updateData) {
    return await TravelListingModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete travel listing (set inactive)
   * @param {string} id - Listing ID
   * @returns {Promise<Object>} Deleted listing
   */
  async delete(id) {
    return await TravelListingModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
  }

  /**
   * Search travel listings
   * @param {Object} searchCriteria - Search criteria
   * @returns {Promise<Array>} Search results
   */
  async search(searchCriteria) {
    const query = {};

    // Search by category
    if (searchCriteria.category) {
      query.category = searchCriteria.category;
    }

    // Search by location
    if (searchCriteria.location) {
      query['location.city'] = { $regex: searchCriteria.location, $options: 'i' };
    }

    // Search by price range
    if (searchCriteria.minPrice || searchCriteria.maxPrice) {
      query.price = {};
      if (searchCriteria.minPrice) {
        query.price.$gte = parseFloat(searchCriteria.minPrice);
      }
      if (searchCriteria.maxPrice) {
        query.price.$lte = parseFloat(searchCriteria.maxPrice);
      }
    }

    // Search by date availability
    if (searchCriteria.startDate && searchCriteria.endDate) {
      const startDate = new Date(searchCriteria.startDate);
      const endDate = new Date(searchCriteria.endDate);
      
      query.availableDates = {
        $elemMatch: {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate }
        }
      };
    }

    // Text search
    if (searchCriteria.keyword) {
      query.$or = [
        { title: { $regex: searchCriteria.keyword, $options: 'i' } },
        { description: { $regex: searchCriteria.keyword, $options: 'i' } }
      ];
    }

    // Get listings with options
    return await this.getAll(query, {
      sort: searchCriteria.sort || '-createdAt',
      page: searchCriteria.page,
      limit: searchCriteria.limit,
      count: true
    });
  }

  /**
   * Get featured listings
   * @param {number} limit - Number of featured listings to return
   * @returns {Promise<Array>} Featured listings
   */
  async getFeatured(limit = 4) {
    return await TravelListingModel.find({ featured: true })
      .sort('-createdAt')
      .limit(limit);
  }
}

module.exports = TravelListing;