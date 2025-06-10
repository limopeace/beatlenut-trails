const express = require('express');
const router = express.Router();
const esmProductController = require('../../controllers/esmProduct');
const { authenticate, authorize } = require('../../middleware/auth');
const { authenticateESM, authenticateESMSeller } = require('../../middleware/esmAuth');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * @swagger
 * /api/esm/products:
 *   get:
 *     summary: Get all ESM products
 *     tags: [ESM Products]
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
 *         description: A list of products
 *       500:
 *         description: Server error
 */
router.get('/', esmProductController.getAllProducts);

/**
 * @swagger
 * /api/esm/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [ESM Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', esmProductController.getProductById);

/**
 * @swagger
 * /api/esm/products:
 *   post:
 *     summary: Create a new product
 *     tags: [ESM Products]
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
 *               - price
 *               - category
 *               - description
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 default: 1
 *               weight:
 *                 type: string
 *               dimensions:
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
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateESMSeller, esmProductController.createProduct);

/**
 * @swagger
 * /api/esm/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [ESM Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               weight:
 *                 type: string
 *               dimensions:
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
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateESMSeller, esmProductController.updateProduct);

/**
 * @swagger
 * /api/esm/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [ESM Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateESMSeller, esmProductController.deleteProduct);

/**
 * @swagger
 * /api/esm/products/seller/{sellerId}:
 *   get:
 *     summary: Get all products by seller ID
 *     tags: [ESM Products]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: A list of products
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */
router.get('/seller/:sellerId', esmProductController.getProductsBySeller);

/**
 * @swagger
 * /api/esm/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [ESM Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: A list of featured products
 *       500:
 *         description: Server error
 */
router.get('/featured', esmProductController.getFeaturedProducts);

/**
 * @swagger
 * /api/esm/products/upload:
 *   post:
 *     summary: Upload product image
 *     tags: [ESM Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/upload', authenticateESMSeller, upload.single('image'), esmProductController.uploadImage);

module.exports = router;