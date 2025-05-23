/**
 * Repository for managing notification data
 */
const NotificationModel = require('../models/mongoose/notificationModel');

class NotificationRepository {
  /**
   * Create a new notification
   * @param {Object} data - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async create(data) {
    try {
      const notification = new NotificationModel(data);
      return await notification.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all notifications with optional filters
   * @param {Object} filter - Optional query filters
   * @param {Object} options - Query options (sort, limit, etc)
   * @returns {Promise<Array>} List of notifications
   */
  async getAll(filter = {}, options = {}) {
    try {
      const query = NotificationModel.find(filter);
      
      // Apply sorting
      if (options.sort) {
        query.sort(options.sort);
      } else {
        query.sort({ createdAt: -1 }); // Default sort by newest
      }
      
      // Apply pagination
      if (options.limit) {
        query.limit(options.limit);
      }
      
      if (options.skip) {
        query.skip(options.skip);
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Notification object
   */
  async getById(id) {
    try {
      return await NotificationModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update notification
   * @param {string} id - Notification ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated notification
   */
  async update(id, data) {
    try {
      return await NotificationModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Deleted notification
   */
  async delete(id) {
    try {
      return await NotificationModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(id) {
    try {
      return await NotificationModel.findByIdAndUpdate(
        id,
        { status: 'read' },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as archived
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsArchived(id) {
    try {
      return await NotificationModel.findByIdAndUpdate(
        id,
        { status: 'archived' },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get count of new notifications
   * @returns {Promise<number>} Count of new notifications
   */
  async getNewNotificationsCount() {
    try {
      return await NotificationModel.countDocuments({ status: 'new' }).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get notifications by type
   * @param {string} type - Notification type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of notifications
   */
  async getByType(type, options = {}) {
    try {
      return await this.getAll({ type }, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as emailed
   * @param {string} id - Notification ID
   * @param {string} emailAddress - Email address notification was sent to
   * @returns {Promise<Object>} Updated notification
   */
  async markAsEmailed(id, emailAddress) {
    try {
      return await NotificationModel.findByIdAndUpdate(
        id,
        { 
          isEmailed: true, 
          emailedTo: emailAddress,
          emailedAt: new Date()
        },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Update result
   */
  async markAllAsRead() {
    try {
      return await NotificationModel.updateMany(
        { status: 'new' },
        { status: 'read' }
      ).exec();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NotificationRepository();