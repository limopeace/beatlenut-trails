const express = require('express');
const router = express.Router();
const bikeRentalController = require('../controllers/bikeRental');
const bikeRentalValidator = require('../validators/bikeRental');
const { authenticate, authorize } = require('../middleware/auth');
const isAdmin = authorize(['admin']);

/**
 * @swagger
 * /api/bike-rentals:
 *   get:
 *     summary: Get all bike rentals with optional filtering
 *     tags: [Bike Rentals]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by bike category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: availability
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
 *     responses:
 *       200:
 *         description: List of bike rentals
 */
router.get('/', 
  bikeRentalValidator.filter,
  bikeRentalController.getAllBikeRentals
);

/**
 * @swagger
 * /api/bike-rentals/featured:
 *   get:
 *     summary: Get featured bike rentals
 *     tags: [Bike Rentals]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of rentals to return
 *     responses:
 *       200:
 *         description: List of featured bike rentals
 */
router.get('/featured',
  bikeRentalValidator.filter,
  bikeRentalController.getFeaturedBikeRentals
);

/**
 * @swagger
 * /api/bike-rentals/{id}:
 *   get:
 *     summary: Get bike rental by ID
 *     tags: [Bike Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bike rental ID
 *     responses:
 *       200:
 *         description: Bike rental details
 *       404:
 *         description: Bike rental not found
 */
router.get('/:id',
  bikeRentalValidator.getById,
  bikeRentalController.getBikeRentalById
);

/**
 * @swagger
 * /api/bike-rentals/category/{category}:
 *   get:
 *     summary: Get bike rentals by category
 *     tags: [Bike Rentals]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Bike category
 *     responses:
 *       200:
 *         description: List of bike rentals in the category
 */
router.get('/category/:category',
  bikeRentalController.getBikeRentalsByCategory
);

// Admin routes - require authentication
/**
 * @swagger
 * /api/bike-rentals:
 *   post:
 *     summary: Create new bike rental
 *     tags: [Bike Rentals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - pricePerDay
 *               - imageSrc
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               imageSrc:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *               availability:
 *                 type: boolean
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Bike rental created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/',
  authenticate,
  isAdmin,
  bikeRentalValidator.create,
  bikeRentalController.createBikeRental
);

/**
 * @swagger
 * /api/bike-rentals/{id}:
 *   put:
 *     summary: Update bike rental
 *     tags: [Bike Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bike rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               imageSrc:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *               availability:
 *                 type: boolean
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bike rental updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike rental not found
 */
router.put('/:id',
  authenticate,
  isAdmin,
  bikeRentalValidator.update,
  bikeRentalController.updateBikeRental
);

/**
 * @swagger
 * /api/bike-rentals/{id}:
 *   delete:
 *     summary: Delete bike rental
 *     tags: [Bike Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bike rental ID
 *     responses:
 *       204:
 *         description: Bike rental deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike rental not found
 */
router.delete('/:id',
  authenticate,
  isAdmin,
  bikeRentalValidator.delete,
  bikeRentalController.deleteBikeRental
);

/**
 * @swagger
 * /api/bike-rentals/{id}/availability:
 *   patch:
 *     summary: Update bike rental availability
 *     tags: [Bike Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bike rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availability
 *             properties:
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike rental not found
 */
router.patch('/:id/availability',
  authenticate,
  isAdmin,
  bikeRentalValidator.updateAvailability,
  bikeRentalController.updateAvailability
);

module.exports = router;