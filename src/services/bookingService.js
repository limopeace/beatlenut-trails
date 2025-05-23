/**
 * Booking Service
 */
const Booking = require('../models/booking');
const TravelListingService = require('./travelListingService');
const emailService = require('./emailService');
const { NotFoundError, BadRequestError } = require('../utils/errors');

class BookingService {
  constructor() {
    this.bookingModel = new Booking();
    this.travelListingService = new TravelListingService();
  }

  /**
   * Create new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    // Check if listing exists and has availability
    const listing = await this.travelListingService.getListingById(bookingData.listing);
    
    // Check availability
    const availability = await this.travelListingService.checkAvailability(
      bookingData.listing,
      bookingData.startDate,
      bookingData.endDate,
      bookingData.numberOfGuests
    );
    
    if (!availability.available) {
      throw new BadRequestError('Selected dates are not available for booking');
    }
    
    // Calculate total price (simplified for now)
    // In a real app, this would involve more complex logic based on duration, guests, etc.
    const duration = Math.ceil(
      (new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)
    );
    
    let totalPrice;
    if (listing.price.priceType === 'per_person') {
      totalPrice = listing.price.amount * bookingData.numberOfGuests;
    } else if (listing.price.priceType === 'per_night') {
      totalPrice = listing.price.amount * duration;
    } else {
      totalPrice = listing.price.amount; // total price
    }
    
    // Apply discount if available
    if (listing.discountPrice && listing.discountPrice.amount && 
        (!listing.discountPrice.expiresAt || new Date(listing.discountPrice.expiresAt) > new Date())) {
      totalPrice = listing.discountPrice.amount;
    }
    
    // Create booking with calculated price
    bookingData.totalPrice = totalPrice;
    
    // Create the booking
    const booking = await this.bookingModel.create(bookingData);
    
    // Send verification email
    await this._sendVerificationEmail(booking);
    
    // Send admin notification
    await this._sendAdminNotification(booking);
    
    return booking;
  }

  /**
   * Get booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Booking
   */
  async getBookingById(id) {
    const booking = await this.bookingModel.getById(id);
    
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    
    return booking;
  }

  /**
   * Get all bookings (admin only)
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Bookings with pagination
   */
  async getAllBookings(query = {}) {
    const options = {
      sort: query.sort || '-createdAt',
      page: query.page || 1,
      limit: query.limit || 10,
      count: true
    };
    
    return await this.bookingModel.getAll({}, options);
  }

  /**
   * Get bookings by user ID
   * @param {string} userId - User ID
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} User's bookings with pagination
   */
  async getUserBookings(userId, query = {}) {
    const options = {
      sort: query.sort || '-createdAt',
      page: query.page || 1,
      limit: query.limit || 10,
      count: true
    };
    
    return await this.bookingModel.getByUser(userId, options);
  }

  /**
   * Get bookings by email (for non-registered users)
   * @param {string} email - User email
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} User's bookings with pagination
   */
  async getBookingsByEmail(email, query = {}) {
    const options = {
      sort: query.sort || '-createdAt',
      page: query.page || 1,
      limit: query.limit || 10,
      count: true
    };
    
    return await this.bookingModel.getByEmail(email, options);
  }

  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated booking
   */
  async updateBookingStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const booking = await this.getBookingById(id);
    
    // Update the status
    const updatedBooking = await this.bookingModel.update(id, { status });
    
    // Send status update email
    await this._sendStatusUpdateEmail(updatedBooking);
    
    return updatedBooking;
  }

  /**
   * Verify booking email
   * @param {string} id - Booking ID
   * @param {string} code - Verification code
   * @returns {Promise<Object>} Verified booking
   */
  async verifyBookingEmail(id, code) {
    const verified = await this.bookingModel.verifyEmail(id, code);
    
    if (!verified) {
      throw new BadRequestError('Invalid verification code');
    }
    
    const booking = await this.getBookingById(id);
    
    // Auto-confirm booking if email is verified
    if (booking.status === 'pending') {
      return await this.updateBookingStatus(id, 'confirmed');
    }
    
    return booking;
  }

  /**
   * Mark booking as viewed by admin
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Updated booking
   */
  async markAsViewed(id) {
    return await this.bookingModel.markAsViewed(id);
  }

  /**
   * Get unread bookings count for admin
   * @returns {Promise<number>} Count of unread bookings
   */
  async getUnreadCount() {
    return await this.bookingModel.getUnreadCount();
  }

  /**
   * Send verification email to user
   * @param {Object} booking - Booking object
   * @returns {Promise<boolean>} True if email sent successfully
   * @private
   */
  async _sendVerificationEmail(booking) {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/verify/${booking._id}/${booking.verificationCode}`;
    
    const emailData = {
      name: booking.guestName,
      email: booking.guestEmail,
      subject: 'Verify Your Booking - BeatlenutTrails',
      message: `
Hello ${booking.guestName},

Thank you for booking with BeatlenutTrails!

To confirm your booking, please verify your email by clicking the link below:
${verifyUrl}

Your verification code is: ${booking.verificationCode}

Booking Details:
- Listing: ${booking.listing.title}
- Dates: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}
- Guests: ${booking.numberOfGuests}
- Total Price: $${booking.totalPrice}

If you have any questions, feel free to reply to this email.

Best Regards,
BeatlenutTrails Team
      `
    };
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #2A4030;
      color: white;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
    }
    .booking-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .verification-button {
      display: inline-block;
      background-color: #2A4030;
      color: white !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .verification-code {
      background-color: #eee;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 18px;
      text-align: center;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Verify Your Booking</h2>
    </div>
    <div class="content">
      <p>Hello ${booking.guestName},</p>
      
      <p>Thank you for booking with BeatlenutTrails!</p>
      
      <p>To confirm your booking, please verify your email by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${verifyUrl}" class="verification-button">Verify Email</a>
      </div>
      
      <p>Or you can use this verification code:</p>
      
      <div class="verification-code">
        ${booking.verificationCode}
      </div>
      
      <div class="booking-details">
        <h3>Booking Details:</h3>
        <p><strong>Listing:</strong> ${booking.listing.title}</p>
        <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
      </div>
      
      <p>If you have any questions, feel free to reply to this email.</p>
      
      <p>Best Regards,<br>BeatlenutTrails Team</p>
    </div>
  </div>
</body>
</html>
    `;
    
    emailData.html = html;
    
    // Use custom email sending
    return await emailService.sendContactFormEmail(emailData);
  }

  /**
   * Send admin notification about new booking
   * @param {Object} booking - Booking object
   * @returns {Promise<boolean>} True if email sent successfully
   * @private
   */
  async _sendAdminNotification(booking) {
    const emailData = {
      subject: `New Booking: ${booking.listing.title}`,
      message: `
New booking received!

Booking Details:
- ID: ${booking._id}
- Listing: ${booking.listing.title}
- Guest: ${booking.guestName} (${booking.guestEmail})
- Dates: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}
- Guests: ${booking.numberOfGuests}
- Total Price: $${booking.totalPrice}
- Status: ${booking.status}

View booking in admin panel: ${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/bookings/${booking._id}
      `
    };
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #2A4030;
      color: white;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
    }
    .booking-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .admin-button {
      display: inline-block;
      background-color: #2A4030;
      color: white !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Booking Received</h2>
    </div>
    <div class="content">
      <p>A new booking has been received!</p>
      
      <div class="booking-details">
        <h3>Booking Details:</h3>
        <p><strong>ID:</strong> ${booking._id}</p>
        <p><strong>Listing:</strong> ${booking.listing.title}</p>
        <p><strong>Guest:</strong> ${booking.guestName} (${booking.guestEmail})</p>
        <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/bookings/${booking._id}" class="admin-button">View in Admin Panel</a>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    
    emailData.html = html;
    
    // Use admin notification method
    return await emailService.sendAdminNotification(emailData);
  }

  /**
   * Send status update email
   * @param {Object} booking - Booking object
   * @returns {Promise<boolean>} True if email sent successfully
   * @private
   */
  async _sendStatusUpdateEmail(booking) {
    let subject, messageContent;
    
    switch (booking.status) {
      case 'confirmed':
        subject = 'Your Booking is Confirmed';
        messageContent = 'Your booking has been confirmed. We look forward to welcoming you!';
        break;
      case 'cancelled':
        subject = 'Your Booking Has Been Cancelled';
        messageContent = 'Your booking has been cancelled. If you have any questions, please contact us.';
        break;
      case 'completed':
        subject = 'Your Booking is Completed';
        messageContent = 'Your booking has been marked as completed. We hope you enjoyed your experience!';
        break;
      default:
        subject = 'Booking Status Update';
        messageContent = `Your booking status has been updated to: ${booking.status}`;
    }
    
    const emailData = {
      name: booking.guestName,
      email: booking.guestEmail,
      subject: `${subject} - BeatlenutTrails`,
      message: `
Hello ${booking.guestName},

${messageContent}

Booking Details:
- Listing: ${booking.listing.title}
- Dates: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}
- Guests: ${booking.numberOfGuests}
- Total Price: $${booking.totalPrice}
- Status: ${booking.status}

If you have any questions, feel free to reply to this email.

Best Regards,
BeatlenutTrails Team
      `
    };
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #2A4030;
      color: white;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
    }
    .booking-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
    }
    .status-confirmed {
      background-color: #d4edda;
      color: #155724;
    }
    .status-cancelled {
      background-color: #f8d7da;
      color: #721c24;
    }
    .status-completed {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${subject}</h2>
    </div>
    <div class="content">
      <p>Hello ${booking.guestName},</p>
      
      <p>${messageContent}</p>
      
      <div class="booking-details">
        <h3>Booking Details:</h3>
        <p><strong>Listing:</strong> ${booking.listing.title}</p>
        <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        <p><strong>Status:</strong> <span class="status status-${booking.status}">${booking.status.toUpperCase()}</span></p>
      </div>
      
      <p>If you have any questions, feel free to reply to this email.</p>
      
      <p>Best Regards,<br>BeatlenutTrails Team</p>
    </div>
  </div>
</body>
</html>
    `;
    
    emailData.html = html;
    
    // Use custom email sending
    return await emailService.sendContactFormEmail(emailData);
  }
}

module.exports = BookingService;