const mongoose = require('mongoose');

const bikeRentalSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

// Create virtual property for formatted price
bikeRentalSchema.virtual('formattedPrice').get(function() {
  return `$${this.pricePerDay.toFixed(2)}/day`;
});

// Add full image URL method
bikeRentalSchema.methods.getFullImageUrl = function(baseUrl) {
  if (this.imageSrc.startsWith('http')) {
    return this.imageSrc;
  }
  return `${baseUrl}${this.imageSrc}`;
};

// Add toJSON configuration to include virtuals
bikeRentalSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('BikeRental', bikeRentalSchema);