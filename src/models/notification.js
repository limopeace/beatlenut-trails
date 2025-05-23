/**
 * Notification model for admin dashboard
 * Tracks user interactions with CTAs across the site
 */
const mongoose = require('mongoose');

class Notification {
  initSchema() {
    const schema = new mongoose.Schema({
      type: {
        type: String,
        enum: ['contact', 'booking', 'newsletter', 'bikeRental', 'travelPackage', 'general'],
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      message: {
        type: String,
        required: true
      },
      source: {
        type: String,
        enum: ['homepage', 'contact', 'bikeRentals', 'services', 'about', 'other'],
        default: 'other'
      },
      userData: {
        name: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
        },
        phone: {
          type: String,
          trim: true,
        },
        additionalData: {
          type: mongoose.Schema.Types.Mixed
        }
      },
      status: {
        type: String,
        enum: ['new', 'read', 'archived'],
        default: 'new'
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      isEmailed: {
        type: Boolean,
        default: false
      },
      emailedTo: {
        type: String,
        trim: true
      },
      emailedAt: {
        type: Date
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }, {
      timestamps: true,
      collection: 'notifications'
    });

    // Create model from schema if it doesn't exist
    try {
      mongoose.model('Notification');
    } catch (error) {
      mongoose.model('Notification', schema);
    }
  }

  getInstance() {
    this.initSchema();
    return mongoose.model('Notification');
  }
}

module.exports = Notification;