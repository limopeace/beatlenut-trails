/**
 * Travel Listing Model
 */
const mongoose = require('mongoose');
const slugify = require('slugify');

const travelListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A travel listing must have a title'],
      trim: true,
      maxlength: [100, 'A listing title cannot be more than 100 characters'],
      minlength: [5, 'A listing title must be at least 5 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'A travel listing must have a description'],
      trim: true
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [200, 'Summary cannot be more than 200 characters']
    },
    location: {
      address: String,
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: String,
      country: {
        type: String,
        required: [true, 'Country is required']
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined
      }
    },
    category: {
      type: String,
      required: [true, 'A listing must have a category'],
      enum: {
        values: ['hotel', 'resort', 'tour', 'adventure', 'sightseeing', 'cruise', 'retreat', 'camping'],
        message: 'Category must be one of: hotel, resort, tour, adventure, sightseeing, cruise, retreat, camping'
      }
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks'],
        default: 'days'
      }
    },
    price: {
      amount: {
        type: Number,
        required: [true, 'A listing must have a price']
      },
      currency: {
        type: String,
        default: 'USD'
      },
      priceType: {
        type: String,
        enum: ['per_person', 'per_night', 'total'],
        default: 'per_person'
      }
    },
    discountPrice: {
      amount: Number,
      expiresAt: Date
    },
    images: [String],
    mainImage: String,
    amenities: [String],
    highlights: [String],
    includedServices: [String],
    excludedServices: [String],
    availableDates: [{
      startDate: Date,
      endDate: Date,
      availability: {
        type: Number,
        default: 10
      }
    }],
    reviews: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // round to 1 decimal place
      },
      count: {
        type: Number,
        default: 0
      }
    },
    restrictions: {
      minAge: Number,
      maxAge: Number,
      accessibility: {
        type: String,
        enum: ['easy', 'moderate', 'difficult', 'not_accessible']
      },
      requiredFitness: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    featured: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A listing must have an author']
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// INDEXES
travelListingSchema.index({ price: 1 });
travelListingSchema.index({ slug: 1 });
travelListingSchema.index({ location: '2dsphere' });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
travelListingSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// QUERY MIDDLEWARE
travelListingSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// AGGREGATION MIDDLEWARE
travelListingSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
  next();
});

const TravelListing = mongoose.model('TravelListing', travelListingSchema);

module.exports = TravelListing;