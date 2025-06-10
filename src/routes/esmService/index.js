const express = require('express');
const router = express.Router();
const esmServiceController = require('../../controllers/esmService');
const { authenticate, authorize } = require('../../middleware/auth');
const { authenticateESM, authenticateESMSeller } = require('../../middleware/esmAuth');

/**
 * @swagger
 * /api/esm/services:
 *   get:
 *     summary: Get all ESM services
 *     tags: [ESM Services]
 *     parameters:
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *         description: Filter by seller ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: A list of services
 *       500:
 *         description: Server error
 */
router.get('/', esmServiceController.getAllServices);

/**
 * @swagger
 * /api/esm/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [ESM Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/:id', esmServiceController.getServiceById);

/**
 * @swagger
 * /api/esm/services:
 *   post:
 *     summary: Create a new service
 *     tags: [ESM Services]
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
 *               - basePrice
 *               - category
 *               - description
 *               - location
 *               - images
 *               - packages
 *             properties:
 *               name:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               location:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *                 default: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               packages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateESMSeller, esmServiceController.createService);

/**
 * @swagger
 * /api/esm/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [ESM Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               location:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               packages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the service owner
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateESMSeller, esmServiceController.updateService);

/**
 * @swagger
 * /api/esm/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [ESM Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the service owner
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateESMSeller, esmServiceController.deleteService);

/**
 * @swagger
 * /api/esm/services/seller/{sellerId}:
 *   get:
 *     summary: Get all services by seller ID
 *     tags: [ESM Services]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: A list of services
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */
router.get('/seller/:sellerId', esmServiceController.getServicesBySeller);

/**
 * @swagger
 * /api/esm/services/featured:
 *   get:
 *     summary: Get featured services
 *     tags: [ESM Services]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: A list of featured services
 *       500:
 *         description: Server error
 */
router.get('/featured', esmServiceController.getFeaturedServices);

module.exports = router;