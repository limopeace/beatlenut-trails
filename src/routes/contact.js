/**
 * Contact routes
 */
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validate } = require('../middleware/validator');
const contactSchema = require('../validators/contact');

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     description: Submit a contact form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sender's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Sender's email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 description: Sender's phone (optional)
 *                 example: +91 9876543210
 *               subject:
 *                 type: string
 *                 description: Email subject
 *                 example: Trip Planning
 *               message:
 *                 type: string
 *                 description: Email message
 *                 example: I'm interested in planning a trip to Northeast India.
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
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
 *                   example: Contact form submitted successfully. We will get back to you soon.
 *       400:
 *         description: Invalid request data
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
router.post('/', validate(contactSchema), contactController.submitContact);

module.exports = router;