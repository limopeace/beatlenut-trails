/**
 * Booking Controller
 */
const BookingService = require('../services/bookingService');
const bookingService = new BookingService();

const bookingController = {
  /**
   * Create new booking
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createBooking: async (req, res, next) => {
    try {
      // If user is authenticated, add user ID to booking data
      if (req.user) {
        req.body.user = req.user.id;
      }
      
      const booking = await bookingService.createBooking(req.body);
      
      res.status(201).json({
        status: 'success',
        data: {
          booking,
          message: 'Booking created. Please check your email to verify and confirm the booking.'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get booking by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getBookingById: async (req, res, next) => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      
      // If user is not admin and booking doesn't belong to them, restrict access
      if (req.user && req.user.role !== 'admin' && 
          booking.user && booking.user.toString() !== req.user.id && 
          booking.guestEmail !== req.user.email) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to access this booking'
        });
      }
      
      res.json({
        status: 'success',
        data: {
          booking
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all bookings (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllBookings: async (req, res, next) => {
    try {
      const bookings = await bookingService.getAllBookings(req.query);
      
      res.json({
        status: 'success',
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user's bookings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getUserBookings: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const bookings = await bookingService.getUserBookings(userId, req.query);
      
      res.json({
        status: 'success',
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get bookings by email (for non-registered users)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getBookingsByEmail: async (req, res, next) => {
    try {
      const { email } = req.body;
      
      // Ensure email is provided
      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email is required'
        });
      }
      
      const bookings = await bookingService.getBookingsByEmail(email, req.query);
      
      res.json({
        status: 'success',
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update booking status (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateBookingStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const booking = await bookingService.updateBookingStatus(id, status);
      
      res.json({
        status: 'success',
        data: {
          booking
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify booking email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  verifyBookingEmail: async (req, res, next) => {
    try {
      const { id, code } = req.params;
      
      const booking = await bookingService.verifyBookingEmail(id, code);
      
      res.json({
        status: 'success',
        data: {
          booking,
          message: 'Email verified successfully. Your booking is now confirmed.'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark booking as viewed by admin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  markAsViewed: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const booking = await bookingService.markAsViewed(id);
      
      res.json({
        status: 'success',
        data: {
          booking
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get unread bookings count (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getUnreadCount: async (req, res, next) => {
    try {
      const count = await bookingService.getUnreadCount();
      
      res.json({
        status: 'success',
        data: {
          count
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookingController;