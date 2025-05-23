const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'ESMProduct',
    required: function() {
      return !this.service;
    }
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'ESMProduct', // Using same model with different type
    required: function() {
      return !this.product;
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  options: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  notes: {
    type: String,
    maxlength: 1000
  }
});

const addressSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  line1: {
    type: String,
    required: true,
    trim: true
  },
  line2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
});

const paymentSchema = new Schema({
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod']
  },
  transactionId: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  },
  refundDate: {
    type: Date
  }
});

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'ESMSeller',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending', 
      'processing', 
      'confirmed', 
      'shipped', 
      'delivered', 
      'completed', 
      'cancelled', 
      'refunded'
    ],
    default: 'pending'
  },
  shippingAddress: {
    type: addressSchema,
    required: function() {
      // Only required for physical products
      return this.items.some(item => item.product);
    }
  },
  billingAddress: {
    type: addressSchema,
    required: true
  },
  payment: {
    type: paymentSchema,
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  couponCode: {
    type: String
  },
  notes: {
    type: String
  },
  trackingInfo: {
    carrier: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    estimatedDelivery: {
      type: Date
    }
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
      enum: [
        'pending', 
        'processing', 
        'confirmed', 
        'shipped', 
        'delivered', 
        'completed', 
        'cancelled', 
        'refunded'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isFulfilled: {
    type: Boolean,
    default: false
  },
  fulfillmentDate: {
    type: Date
  },
  isServiceOrder: {
    type: Boolean,
    default: false
  },
  serviceSchedule: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    duration: {
      type: Number // in minutes
    },
    location: {
      type: String
    }
  },
  cancellationReason: {
    type: String
  },
  platformFee: {
    type: Number,
    required: true,
    default: 0
  },
  sellerPayout: {
    type: Number,
    required: true,
    default: 0
  },
  payoutStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending'
  },
  payoutDate: {
    type: Date
  },
  hasIssue: {
    type: Boolean,
    default: false
  },
  issueType: {
    type: String,
    enum: ['payment', 'delivery', 'product', 'service', 'other']
  },
  issueDescription: {
    type: String
  },
  issueResolution: {
    type: String
  },
  isInDispute: {
    type: Boolean,
    default: false
  },
  disputeDetails: {
    type: Schema.Types.Mixed
  },
  sellerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  buyerRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Indexes for faster queries
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'items.product': 1 });
orderSchema.index({ 'items.service': 1 });

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  const datePrefix = `ESM${year}${month}${day}`;
  
  // Find the highest order number with this prefix
  const lastOrder = await this.constructor.findOne({
    orderNumber: new RegExp(`^${datePrefix}`)
  }).sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-5));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }
  
  this.orderNumber = `${datePrefix}${sequence.toString().padStart(5, '0')}`;
  next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shippingFee - this.discount;
  
  // Calculate seller payout (subtotal - platform fee)
  this.sellerPayout = this.subtotal - this.platformFee;
  
  // Add status change to history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  
  next();
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const createdAt = this.createdAt;
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const nonCancellableStatuses = ['shipped', 'delivered', 'completed', 'cancelled', 'refunded'];
  return !nonCancellableStatuses.includes(this.status);
};

// Method to check if order can be refunded
orderSchema.methods.canBeRefunded = function() {
  const refundableStatuses = ['delivered', 'completed'];
  // Can be refunded if delivered/completed within 7 days
  return refundableStatuses.includes(this.status) && this.ageInDays <= 7;
};

// Method to add a tracking number
orderSchema.methods.addTracking = function(carrier, trackingNumber, estimatedDelivery) {
  this.trackingInfo = {
    carrier,
    trackingNumber,
    estimatedDelivery: estimatedDelivery || null
  };
  
  if (this.status === 'confirmed') {
    this.status = 'shipped';
    this.statusHistory.push({
      status: 'shipped',
      timestamp: new Date(),
      note: `Shipped via ${carrier}, tracking: ${trackingNumber}`
    });
  }
  
  return this.save();
};

// Method to mark as delivered
orderSchema.methods.markDelivered = function() {
  if (this.status !== 'shipped') {
    throw new Error(`Cannot mark as delivered. Current status: ${this.status}`);
  }
  
  this.status = 'delivered';
  this.statusHistory.push({
    status: 'delivered',
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to complete an order
orderSchema.methods.complete = function() {
  if (!['delivered', 'confirmed'].includes(this.status)) {
    throw new Error(`Cannot complete order. Current status: ${this.status}`);
  }
  
  this.status = 'completed';
  this.isFulfilled = true;
  this.fulfillmentDate = new Date();
  this.statusHistory.push({
    status: 'completed',
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to cancel an order
orderSchema.methods.cancel = function(reason) {
  if (!this.canBeCancelled()) {
    throw new Error(`Cannot cancel order. Current status: ${this.status}`);
  }
  
  this.status = 'cancelled';
  this.cancellationReason = reason || 'No reason provided';
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: `Cancelled: ${this.cancellationReason}`
  });
  
  return this.save();
};

// Method to refund an order
orderSchema.methods.refund = function(amount, reason) {
  if (this.payment.status === 'refunded') {
    throw new Error('Order is already refunded');
  }
  
  // If amount not specified, refund full amount
  const refundAmount = amount || this.total;
  
  // Update payment information
  this.payment.refundAmount = refundAmount;
  this.payment.refundReason = reason || 'No reason provided';
  this.payment.refundDate = new Date();
  
  // If full refund, update status
  if (refundAmount >= this.total) {
    this.payment.status = 'refunded';
    this.status = 'refunded';
  } else {
    this.payment.status = 'partially_refunded';
  }
  
  this.statusHistory.push({
    status: this.status,
    timestamp: new Date(),
    note: `Refunded ${refundAmount}: ${this.payment.refundReason}`
  });
  
  return this.save();
};

// Export model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;