const express = require('express');
const router = express.Router();
const exampleRoutes = require('./example');
const authRoutes = require('./auth');

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

// Mount API routes
router.use('/examples', exampleRoutes);

module.exports = router;