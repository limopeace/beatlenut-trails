/**
 * Notification routes
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const notificationValidator = require('../validators/notification');
const { authenticate, authorize } = require('../middleware/auth');
const isAdmin = authorize(['admin']);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [contact, booking, newsletter, bikeRental, travelPackage, general]
 *         description: Filter by notification type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, archived]
 *         description: Filter by notification status
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [homepage, contact, bikeRentals, services, about, other]
 *         description: Filter by notification source
 *     responses:
 *       200:
 *         description: List of notifications with pagination metadata
 *       401:
 *         description: Unauthorized
 */
router.get('/',
  authenticate,
  isAdmin,
  notificationValidator.getAll,
  notificationController.getAllNotifications
);

/**
 * @swagger
 * /api/notifications/count:
 *   get:
 *     summary: Get count of new notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of new notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/count',
  authenticate,
  isAdmin,
  notificationController.getNewNotificationsCount
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.get('/:id',
  authenticate,
  isAdmin,
  notificationValidator.getById,
  notificationController.getNotificationById
);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - message
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [contact, booking, newsletter, bikeRental, travelPackage, general]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum: [homepage, contact, bikeRentals, services, about, other]
 *               userData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   additionalData:
 *                     type: object
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Notification created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/',
  authenticate,
  notificationValidator.create,
  notificationController.createNotification
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.patch('/:id/read',
  authenticate,
  isAdmin,
  notificationValidator.markAsRead,
  notificationController.markAsRead
);

/**
 * @swagger
 * /api/notifications/{id}/archive:
 *   patch:
 *     summary: Mark notification as archived
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as archived
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.patch('/:id/archive',
  authenticate,
  isAdmin,
  notificationValidator.markAsArchived,
  notificationController.markAsArchived
);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch('/read-all',
  authenticate,
  isAdmin,
  notificationController.markAllAsRead
);

module.exports = router;