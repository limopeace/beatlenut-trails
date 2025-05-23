/**
 * Travel Listing routes
 */
const express = require('express');
const router = express.Router();
const travelListingController = require('../controllers/travelListingController');
const { authenticate, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /travel-listings:
 *   get:
 *     summary: Get all travel listings
 *     tags: [Travel Listings]
 *     description: Retrieve all travel listings with optional filtering
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability
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
 *         description: A list of travel listings
 */
router.get('/', travelListingController.getAllListings);

/**
 * @swagger
 * /travel-listings/featured:
 *   get:
 *     summary: Get featured travel listings
 *     tags: [Travel Listings]
 *     description: Retrieve featured travel listings
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of featured listings to return
 *     responses:
 *       200:
 *         description: A list of featured travel listings
 */
router.get('/featured', travelListingController.getFeaturedListings);

/**
 * @swagger
 * /travel-listings/{id}:
 *   get:
 *     summary: Get travel listing by ID
 *     tags: [Travel Listings]
 *     description: Retrieve a travel listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel listing ID
 *     responses:
 *       200:
 *         description: Travel listing details
 *       404:
 *         description: Travel listing not found
 */
router.get('/:id', travelListingController.getListingById);

/**
 * @swagger
 * /travel-listings/slug/{slug}:
 *   get:
 *     summary: Get travel listing by slug
 *     tags: [Travel Listings]
 *     description: Retrieve a travel listing by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel listing slug
 *     responses:
 *       200:
 *         description: Travel listing details
 *       404:
 *         description: Travel listing not found
 */
router.get('/slug/:slug', travelListingController.getListingBySlug);

/**
 * @swagger
 * /travel-listings/{id}/availability:
 *   post:
 *     summary: Check listing availability
 *     tags: [Travel Listings]
 *     description: Check if a travel listing is available for selected dates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - guests
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Availability information
 */
router.post('/:id/availability', travelListingController.checkAvailability);

/**
 * @swagger
 * /travel-listings:
 *   post:
 *     summary: Create a new travel listing
 *     tags: [Travel Listings]
 *     description: Create a new travel listing (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TravelListingRequest'
 *     responses:
 *       201:
 *         description: Travel listing created successfully
 *       401:
 *         description: Unauthorized - No token provided
 */
router.post('/', authenticate, travelListingController.createListing);

/**
 * @swagger
 * /travel-listings/{id}:
 *   patch:
 *     summary: Update a travel listing
 *     tags: [Travel Listings]
 *     description: Update an existing travel listing (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TravelListingUpdateRequest'
 *     responses:
 *       200:
 *         description: Travel listing updated successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: Travel listing not found
 */
router.patch('/:id', authenticate, travelListingController.updateListing);

/**
 * @swagger
 * /travel-listings/{id}:
 *   delete:
 *     summary: Delete a travel listing
 *     tags: [Travel Listings]
 *     description: Delete an existing travel listing (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel listing ID
 *     responses:
 *       204:
 *         description: Travel listing deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: Travel listing not found
 */
router.delete('/:id', authenticate, travelListingController.deleteListing);

module.exports = router;