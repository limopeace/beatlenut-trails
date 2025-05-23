const Joi = require('joi');

/**
 * Order Validators
 * Validation schemas for order operations
 */

// Item schema
const orderItemSchema = Joi.object({
  product: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Product ID must be a valid MongoDB ObjectId'
    }),
  service: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Service ID must be a valid MongoDB ObjectId'
    }),
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
    }),
  options: Joi.object().optional(),
  notes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Notes must not exceed 1000 characters'
    })
}).xor('product', 'service').messages({
  'object.xor': 'Each item must have either product or service, not both'
});

// Address schema
const addressSchema = Joi.object({
  fullName: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name is required',
      'string.max': 'Full name must not exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  line1: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Address line 1 is required',
      'string.min': 'Address line 1 is required',
      'string.max': 'Address line 1 must not exceed 200 characters',
      'any.required': 'Address line 1 is required'
    }),
  line2: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Address line 2 must not exceed 200 characters'
    }),
  city: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City is required',
      'string.max': 'City must not exceed 100 characters',
      'any.required': 'City is required'
    }),
  state: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'State is required',
      'string.min': 'State is required',
      'string.max': 'State must not exceed 100 characters',
      'any.required': 'State is required'
    }),
  postalCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Postal code must be a 6-digit number',
      'any.required': 'Postal code is required'
    }),
  country: Joi.string()
    .min(1)
    .max(100)
    .default('India')
    .messages({
      'string.min': 'Country is required',
      'string.max': 'Country must not exceed 100 characters'
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a 10-digit number',
      'any.required': 'Phone number is required'
    })
});

// Service schedule schema
const serviceScheduleSchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format',
      'date.min': 'Start date must be in the future',
      'any.required': 'Start date is required'
    }),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
  duration: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be an integer',
      'number.min': 'Duration must be at least 1 minute'
    }),
  location: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Location must not exceed 500 characters'
    })
});

// Validation schemas
const orderValidators = {
  /**
   * Create order validation
   */
  createOrder: Joi.object({
    seller: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Seller ID must be a valid MongoDB ObjectId',
        'any.required': 'Seller ID is required'
      }),
    items: Joi.array()
      .items(orderItemSchema)
      .min(1)
      .required()
      .messages({
        'array.base': 'Items must be an array',
        'array.min': 'Order must contain at least one item',
        'any.required': 'Items are required'
      }),
    billingAddress: addressSchema
      .required()
      .messages({
        'any.required': 'Billing address is required'
      }),
    shippingAddress: addressSchema.optional(),
    paymentMethod: Joi.string()
      .valid('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod')
      .required()
      .messages({
        'any.only': 'Invalid payment method',
        'any.required': 'Payment method is required'
      }),
    shippingFee: Joi.number()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Shipping fee must be a number',
        'number.min': 'Shipping fee cannot be negative'
      }),
    discount: Joi.number()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Discount must be a number',
        'number.min': 'Discount cannot be negative'
      }),
    couponCode: Joi.string()
      .max(50)
      .optional()
      .messages({
        'string.max': 'Coupon code must not exceed 50 characters'
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Notes must not exceed 500 characters'
      }),
    serviceSchedule: serviceScheduleSchema.optional()
  }),

  /**
   * Update order status validation
   */
  updateOrderStatus: Joi.object({
    status: Joi.string()
      .valid('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')
      .required()
      .messages({
        'any.only': 'Invalid status',
        'any.required': 'Status is required'
      }),
    note: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Note must not exceed 500 characters'
      })
  }),

  /**
   * Update payment validation
   */
  updatePayment: Joi.object({
    method: Joi.string()
      .valid('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod')
      .optional()
      .messages({
        'any.only': 'Invalid payment method'
      }),
    transactionId: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Transaction ID must not exceed 100 characters'
      }),
    status: Joi.string()
      .valid('pending', 'completed', 'failed', 'refunded', 'partially_refunded')
      .optional()
      .messages({
        'any.only': 'Invalid payment status'
      }),
    gatewayResponse: Joi.object()
      .optional()
  }),

  /**
   * Update tracking validation
   */
  updateTracking: Joi.object({
    carrier: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Carrier is required',
        'string.min': 'Carrier is required',
        'string.max': 'Carrier must not exceed 100 characters',
        'any.required': 'Carrier is required'
      }),
    trackingNumber: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Tracking number is required',
        'string.min': 'Tracking number is required',
        'string.max': 'Tracking number must not exceed 100 characters',
        'any.required': 'Tracking number is required'
      }),
    estimatedDelivery: Joi.date()
      .iso()
      .min('now')
      .optional()
      .messages({
        'date.base': 'Estimated delivery must be a valid date',
        'date.format': 'Estimated delivery must be in ISO format',
        'date.min': 'Estimated delivery must be in the future'
      })
  }),

  /**
   * Cancel order validation
   */
  cancelOrder: Joi.object({
    reason: Joi.string()
      .min(1)
      .max(500)
      .optional()
      .messages({
        'string.min': 'Reason cannot be empty',
        'string.max': 'Reason must not exceed 500 characters'
      })
  }),

  /**
   * Refund order validation
   */
  refundOrder: Joi.object({
    amount: Joi.number()
      .positive()
      .optional()
      .messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive'
      }),
    reason: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Reason is required',
        'string.min': 'Reason is required',
        'string.max': 'Reason must not exceed 500 characters',
        'any.required': 'Reason is required'
      })
  }),

  /**
   * Search orders validation
   */
  searchOrders: Joi.object({
    orderNumber: Joi.string()
      .max(50)
      .optional(),
    buyer: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Buyer ID must be a valid MongoDB ObjectId'
      }),
    seller: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Seller ID must be a valid MongoDB ObjectId'
      }),
    status: Joi.string()
      .valid('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')
      .optional()
      .messages({
        'any.only': 'Invalid status'
      }),
    paymentStatus: Joi.string()
      .valid('pending', 'completed', 'failed', 'refunded', 'partially_refunded')
      .optional()
      .messages({
        'any.only': 'Invalid payment status'
      }),
    dateFrom: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Date from must be a valid date',
        'date.format': 'Date from must be in ISO format'
      }),
    dateTo: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Date to must be a valid date',
        'date.format': 'Date to must be in ISO format'
      }),
    minAmount: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.base': 'Min amount must be a number',
        'number.min': 'Min amount cannot be negative'
      }),
    maxAmount: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.base': 'Max amount must be a number',
        'number.min': 'Max amount cannot be negative'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional(),
    skip: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'total', 'orderNumber', 'status')
      .default('createdAt')
      .optional(),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .optional()
  }),

  /**
   * Query orders validation (for listing endpoints)
   */
  queryOrders: Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional(),
    skip: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'total', 'orderNumber', 'status')
      .default('createdAt')
      .optional(),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .optional(),
    status: Joi.string()
      .valid('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')
      .optional()
      .messages({
        'any.only': 'Invalid status'
      })
  })
};

// Validation middleware functions
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

module.exports = {
  orderValidators,
  validate,
  validateQuery
};