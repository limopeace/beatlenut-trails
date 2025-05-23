const mongoose = require('mongoose');

/**
 * Bike Rental Schema
 * Represents a motorcycle available for rental
 */
class BikeRental {
  initSchema() {
    const schema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      pricePerDay: {
        type: Number,
        required: true,
        min: 0
      },
      imageSrc: {
        type: String,
        required: true
      },
      features: {
        type: [String],
        default: []
      },
      specifications: {
        engine: String,
        power: String,
        torque: String,
        weight: String,
        fuelCapacity: String,
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      availability: {
        type: Boolean,
        default: true
      },
      category: {
        type: String,
        enum: ['touring', 'adventure', 'sport', 'cruiser', 'other'],
        default: 'touring'
      },
      featured: {
        type: Boolean,
        default: false
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
      collection: 'bikeRentals'
    });

    // Create model from schema if it doesn't exist
    try {
      mongoose.model('BikeRental');
    } catch (error) {
      mongoose.model('BikeRental', schema);
    }
  }

  getInstance() {
    this.initSchema();
    return mongoose.model('BikeRental');
  }
}

module.exports = BikeRental;