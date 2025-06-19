const express = require('express');
const router = express.Router();
const exampleRoutes = require('./example');
const authRoutes = require('./auth');
const contactRoutes = require('./contact');
const blogRoutes = require('./blog');
const esmSellerRoutes = require('./esmSeller');
const esmProductRoutes = require('./esmProduct/index');
const esmServiceRoutes = require('./esmService/index');
const orderRoutes = require('./order');
const messageRoutes = require('./message');
const messagesRoutes = require('./messages');
const travelListingRoutes = require('./travelListing');
const bookingRoutes = require('./booking');
const travelReviewRoutes = require('./travelReview');
const bikeRentalRoutes = require('./bikeRental');
const notificationRoutes = require('./notification');
const approvalRoutes = require('./approval');
const adminRoutes = require('./admin');

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Home
 *     description: Get API information
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Welcome to Beatlenuts-GR API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Beatlenuts-GR API',
    version: '1.0.0'
  });
});

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount contact routes
router.use('/contact', contactRoutes);

// Mount blog routes
router.use('/blog', blogRoutes);

// Mount API routes
router.use('/examples', exampleRoutes);

// Mount ESM Marketplace routes
router.use('/esm/sellers', esmSellerRoutes);
router.use('/esm/products', esmProductRoutes);
router.use('/esm/services', esmServiceRoutes);
router.use('/esm/orders', orderRoutes);
router.use('/esm/messages', messageRoutes);

// Mount real-time messaging routes
router.use('/messages', messagesRoutes);

// Mount Travel routes
router.use('/travel-listings', travelListingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/travel-reviews', travelReviewRoutes);
router.use('/bike-rentals', bikeRentalRoutes);

// Mount notification routes
router.use('/notifications', notificationRoutes);

// Mount approval routes
router.use('/approvals', approvalRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

module.exports = router;