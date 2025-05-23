/**
 * Booking model interface
 */
const BookingModel = require('./mongoose/bookingModel');
const { v4: uuidv4 } = require('uuid');

class Booking {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async create(bookingData) {
    // Generate verification code
    bookingData.verificationCode = uuidv4().substring(0, 8).toUpperCase();
    
    return await BookingModel.create(bookingData);
  }

  /**
   * Get all bookings with optional filters
   * @param {Object} filters - Optional filters
   * @param {Object} options - Query options (sort, limit, etc.)
   * @returns {Promise<Array>} Array of bookings
   */
  async getAll(filters = {}, options = {}) {
    const query = BookingModel.find(filters);

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
      total = await BookingModel.countDocuments(filters);
    }

    // Execute query
    const bookings = await query;

    // Return with pagination data if requested
    if (options.count) {
      return {
        data: bookings,
        total,
        page: options.page ? parseInt(options.page, 10) : 1,
        limit: options.limit ? parseInt(options.limit, 10) : bookings.length,
        pages: options.limit ? Math.ceil(total / parseInt(options.limit, 10)) : 1
      };
    }

    return bookings;
  }

  /**
   * Get booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Booking
   */
  async getById(id) {
    return await BookingModel.findById(id);
  }

  /**
   * Update booking
   * @param {string} id - Booking ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated booking
   */
  async update(id, updateData) {
    return await BookingModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Verify booking email
   * @param {string} id - Booking ID
   * @param {string} code - Verification code
   * @returns {Promise<boolean>} Verification result
   */
  async verifyEmail(id, code) {
    const booking = await BookingModel.findById(id);
    
    if (!booking || booking.verificationCode !== code) {
      return false;
    }
    
    booking.verified = true;
    await booking.save();
    
    return true;
  }

  /**
   * Get unread admin bookings count
   * @returns {Promise<number>} Count of unread bookings
   */
  async getUnreadCount() {
    return await BookingModel.countDocuments({ viewedByAdmin: false });
  }

  /**
   * Mark booking as viewed by admin
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Updated booking
   */
  async markAsViewed(id) {
    return await BookingModel.findByIdAndUpdate(
      id,
      { viewedByAdmin: true },
      { new: true }
    );
  }

  /**
   * Get bookings by status
   * @param {string} status - Booking status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings with the specified status
   */
  async getByStatus(status, options = {}) {
    return await this.getAll({ status }, options);
  }

  /**
   * Get bookings for a specific listing
   * @param {string} listingId - Travel listing ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings for the listing
   */
  async getByListing(listingId, options = {}) {
    return await this.getAll({ listing: listingId }, options);
  }

  /**
   * Get bookings for a specific user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's bookings
   */
  async getByUser(userId, options = {}) {
    return await this.getAll({ user: userId }, options);
  }

  /**
   * Get bookings by email (for non-registered users)
   * @param {string} email - Guest email
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings with the specified email
   */
  async getByEmail(email, options = {}) {
    return await this.getAll({ guestEmail: email.toLowerCase() }, options);
  }
}

module.exports = Booking;