const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example');
const { validate } = require('../middleware/validator');
const { createExampleSchema, getExampleByIdSchema } = require('../validators/example');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /examples:
 *   get:
 *     summary: Get all examples
 *     tags: [Examples]
 *     description: Retrieve a list of all examples
 *     responses:
 *       200:
 *         description: A list of examples
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Example'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', exampleController.getAll);

/**
 * @swagger
 * /examples/{id}:
 *   get:
 *     summary: Get an example by ID
 *     tags: [Examples]
 *     description: Retrieve a single example by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the example to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Example details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Example'
 *       404:
 *         description: Example not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(getExampleByIdSchema, 'params'), exampleController.getById);

/**
 * @swagger
 * /examples:
 *   post:
 *     summary: Create a new example
 *     tags: [Examples]
 *     description: Create a new example (requires authentication)
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Example name
 *                 example: New Example
 *               description:
 *                 type: string
 *                 description: Example description
 *                 example: This is a new example
 *     responses:
 *       201:
 *         description: Example created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Example'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', 
  authenticate, 
  validate(createExampleSchema), 
  exampleController.create
);

/**
 * @swagger
 * /examples/{id}:
 *   delete:
 *     summary: Delete an example
 *     tags: [Examples]
 *     description: Delete an example by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the example to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Example retrieved (demo endpoint)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Example'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Example not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id',
  authenticate,
  authorize(['admin']),
  exampleController.getById // Reusing getById for demo purposes, would normally be a delete controller
);

module.exports = router;