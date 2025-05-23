/**
 * Booking routes
 */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const restrictTo = (role) => authorize([role]);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     description: Create a new booking (authentication optional)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /bookings/verify/{id}/{code}:
 *   get:
 *     summary: Verify booking email
 *     tags: [Bookings]
 *     description: Verify a booking email with verification code
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification code
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification code
 */
router.get('/verify/:id/:code', bookingController.verifyBookingEmail);

/**
 * @swagger
 * /bookings/by-email:
 *   post:
 *     summary: Get bookings by email
 *     tags: [Bookings]
 *     description: Get bookings associated with an email (for non-registered users)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: List of bookings for the email
 */
router.post('/by-email', bookingController.getBookingsByEmail);

/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     description: Get bookings for the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of current user's bookings
 *       401:
 *         description: Unauthorized - No token provided
 */
router.get('/my-bookings', authenticate, bookingController.getUserBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     description: Get booking details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get('/:id', bookingController.getBookingById);

// Admin routes
/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Admin]
 *     description: Get all bookings with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (prefix with '-' for descending)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get('/', authenticate, restrictTo('admin'), bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/unread-count:
 *   get:
 *     summary: Get unread bookings count (admin only)
 *     tags: [Admin]
 *     description: Get count of bookings not yet viewed by admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of unread bookings
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get('/unread-count', authenticate, restrictTo('admin'), bookingController.getUnreadCount);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (admin only)
 *     tags: [Admin]
 *     description: Update the status of a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Not an admin
 */
router.patch('/:id/status', authenticate, restrictTo('admin'), bookingController.updateBookingStatus);

/**
 * @swagger
 * /bookings/{id}/mark-viewed:
 *   patch:
 *     summary: Mark booking as viewed (admin only)
 *     tags: [Admin]
 *     description: Mark a booking as viewed by admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking marked as viewed
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Not an admin
 */
router.patch('/:id/mark-viewed', authenticate, restrictTo('admin'), bookingController.markAsViewed);

module.exports = router;