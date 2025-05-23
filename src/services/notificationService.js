/**
 * Notification service for handling admin notifications and emails
 */
const notificationRepository = require('../repositories/notificationRepository');
const emailService = require('./emailService');
const { BadRequestError, NotFoundError } = require('../utils/errors');

class NotificationService {
  /**
   * Create a new notification and optionally send email
   * @param {Object} data - Notification data
   * @param {boolean} sendEmail - Whether to send email notification to admin
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(data, sendEmail = true) {
    try {
      // Validate required fields
      if (!data.type || !data.title || !data.message) {
        throw new BadRequestError('Type, title, and message are required fields');
      }

      // Create notification in database
      const notification = await notificationRepository.create(data);

      // Send email notification if requested
      if (sendEmail) {
        await this.sendEmailForNotification(notification);
      }

      return notification;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send email for notification
   * @param {Object} notification - Notification object
   * @returns {Promise<boolean>} True if email sent successfully
   */
  async sendEmailForNotification(notification) {
    try {
      // Create email content based on notification type
      const emailSubject = `[BeatlenutTrails] New ${this.getTypeDisplay(notification.type)}: ${notification.title}`;
      
      let emailText = `${notification.message}\n\n`;
      
      // Add user data if available
      if (notification.userData) {
        if (notification.userData.name) {
          emailText += `Name: ${notification.userData.name}\n`;
        }
        if (notification.userData.email) {
          emailText += `Email: ${notification.userData.email}\n`;
        }
        if (notification.userData.phone) {
          emailText += `Phone: ${notification.userData.phone}\n`;
        }
        
        // Add any additional data
        if (notification.userData.additionalData) {
          const additionalData = notification.userData.additionalData;
          Object.keys(additionalData).forEach(key => {
            if (additionalData[key]) {
              emailText += `${key}: ${additionalData[key]}\n`;
            }
          });
        }
      }
      
      emailText += `\nSource: ${notification.source}\n`;
      emailText += `Type: ${notification.type}\n`;
      emailText += `Time: ${new Date(notification.createdAt).toLocaleString()}\n`;

      // Send email to admin
      const emailSent = await emailService.sendAdminNotification({
        subject: emailSubject,
        message: emailText
      });
      
      // Update notification with email status
      if (emailSent) {
        await notificationRepository.markAsEmailed(
          notification.id, 
          process.env.ADMIN_EMAIL || 'admin@beatlenuttrails.com'
        );
      }
      
      return emailSent;
    } catch (error) {
      console.error('Error sending notification email:', error);
      return false;
    }
  }

  /**
   * Get all notifications with pagination
   * @param {Object} filter - Optional query filters
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated notifications with metadata
   */
  async getNotifications(filter = {}, page = 1, limit = 20) {
    try {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const total = await notificationRepository.getAll(filter).then(data => data.length);
      
      // Get paginated notifications
      const notifications = await notificationRepository.getAll(filter, { skip, limit });
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Notification object
   */
  async getNotificationById(id) {
    try {
      const notification = await notificationRepository.getById(id);
      if (!notification) {
        throw new NotFoundError('Notification not found');
      }
      return notification;
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
      const notification = await notificationRepository.getById(id);
      if (!notification) {
        throw new NotFoundError('Notification not found');
      }
      return await notificationRepository.markAsRead(id);
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
      const notification = await notificationRepository.getById(id);
      if (!notification) {
        throw new NotFoundError('Notification not found');
      }
      return await notificationRepository.markAsArchived(id);
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
      return await notificationRepository.getNewNotificationsCount();
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
      return await notificationRepository.markAllAsRead();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a notification for a contact form submission
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Created notification
   */
  async createContactNotification(contactData) {
    try {
      const data = {
        type: 'contact',
        title: `New Contact Form: ${contactData.subject || 'General Inquiry'}`,
        message: `New contact form submission from ${contactData.name}`,
        source: 'contact',
        userData: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || '',
          additionalData: {
            subject: contactData.subject || 'General Inquiry',
            message: contactData.message
          }
        },
        priority: 'high'
      };
      
      return await this.createNotification(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a notification for a newsletter subscription
   * @param {Object} subscriptionData - Newsletter subscription data
   * @returns {Promise<Object>} Created notification
   */
  async createNewsletterNotification(subscriptionData) {
    try {
      const data = {
        type: 'newsletter',
        title: 'New Newsletter Subscription',
        message: `New newsletter subscription from ${subscriptionData.email}`,
        source: subscriptionData.source || 'homepage',
        userData: {
          email: subscriptionData.email,
          additionalData: subscriptionData.additionalData || {}
        },
        priority: 'medium'
      };
      
      return await this.createNotification(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a notification for a bike rental inquiry
   * @param {Object} rentalData - Bike rental inquiry data
   * @returns {Promise<Object>} Created notification
   */
  async createBikeRentalNotification(rentalData) {
    try {
      const data = {
        type: 'bikeRental',
        title: `Bike Rental Inquiry: ${rentalData.bikeName || 'General'}`,
        message: `New bike rental inquiry ${rentalData.userData?.name ? `from ${rentalData.userData.name}` : ''}`,
        source: rentalData.source || 'bikeRentals',
        userData: rentalData.userData || {},
        priority: 'high'
      };
      
      return await this.createNotification(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a notification for a travel package booking
   * @param {Object} bookingData - Travel package booking data
   * @returns {Promise<Object>} Created notification
   */
  async createTravelBookingNotification(bookingData) {
    try {
      const data = {
        type: 'booking',
        title: `Travel Booking: ${bookingData.packageName || 'Custom Package'}`,
        message: `New travel package booking ${bookingData.userData?.name ? `from ${bookingData.userData.name}` : ''}`,
        source: bookingData.source || 'services',
        userData: bookingData.userData || {},
        priority: 'high'
      };
      
      return await this.createNotification(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get human-readable notification type display
   * @param {string} type - Notification type
   * @returns {string} Human-readable type
   */
  getTypeDisplay(type) {
    const typeMap = {
      contact: 'Contact Inquiry',
      booking: 'Travel Booking',
      newsletter: 'Newsletter Signup',
      bikeRental: 'Bike Rental Inquiry',
      travelPackage: 'Travel Package Inquiry',
      general: 'Notification'
    };
    
    return typeMap[type] || 'Notification';
  }
}

module.exports = new NotificationService();