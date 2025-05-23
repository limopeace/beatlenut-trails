/**
 * Booking Model
 */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.ObjectId,
      ref: 'TravelListing',
      required: [true, 'Booking must belong to a Travel Listing']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    guestName: {
      type: String,
      required: [true, 'Booking must have a guest name']
    },
    guestEmail: {
      type: String,
      required: [true, 'Booking must have a guest email'],
      lowercase: true,
      validate: {
        validator: function(val) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        },
        message: 'Please provide a valid email address'
      }
    },
    guestPhone: String,
    startDate: {
      type: Date,
      required: [true, 'Booking must have a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Booking must have an end date']
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Booking must have a number of guests'],
      min: [1, 'Number of guests must be at least 1']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    paid: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    specialRequests: String,
    adminNotes: String,
    verificationCode: String,
    verified: {
      type: Boolean,
      default: false
    },
    viewedByAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// INDEXES
bookingSchema.index({ listing: 1, user: 1 });
bookingSchema.index({ startDate: 1 });
bookingSchema.index({ status: 1 });

// QUERY MIDDLEWARE
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'listing',
    select: 'title location images'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;