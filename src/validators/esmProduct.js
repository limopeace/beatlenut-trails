const Joi = require('joi');

/**
 * Validation schemas for ESM Product operations
 */
const esmProductValidator = {
  /**
   * Validate product creation
   */
  createProduct: Joi.object({
    name: Joi.string().trim().min(3).max(100).required()
      .messages({
        'string.min': 'Product name must be at least 3 characters',
        'string.max': 'Product name cannot exceed 100 characters',
        'any.required': 'Product name is required'
      }),
    
    category: Joi.string().valid(
      'handicrafts', 
      'food-products', 
      'clothing-textiles',
      'home-decor', 
      'agriculture-products', 
      'security-services', 
      'consulting-services', 
      'training-services', 
      'technical-services', 
      'other'
    ).required()
    .messages({
      'any.only': 'Please select a valid category',
      'any.required': 'Category is required'
    }),
    
    type: Joi.string().valid('product', 'service').required()
      .messages({
        'any.only': 'Type must be either "product" or "service"',
        'any.required': 'Type is required'
      }),
    
    description: Joi.string().trim().min(20).max(2000).required()
      .messages({
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    
    shortDescription: Joi.string().trim().max(200).allow('', null)
      .messages({
        'string.max': 'Short description cannot exceed 200 characters'
      }),
    
    price: Joi.object({
      amount: Joi.number().min(0).required()
        .messages({
          'number.min': 'Price amount cannot be negative',
          'any.required': 'Price amount is required'
        }),
      currency: Joi.string().default('INR'),
      unit: Joi.string().default('item'),
      isNegotiable: Joi.boolean().default(false)
    }).required()
      .messages({
        'any.required': 'Price information is required'
      }),
    
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required()
          .messages({
            'any.required': 'Image URL is required'
          }),
        alt: Joi.string().default(''),
        isMain: Joi.boolean().default(false)
      })
    ).min(1).required()
      .messages({
        'array.min': 'At least one image is required',
        'any.required': 'Images are required'
      }),
    
    stock: Joi.object({
      available: Joi.number().integer().min(0).default(1)
        .messages({
          'number.min': 'Stock cannot be negative'
        }),
      isLimited: Joi.boolean().default(true)
    }).when('type', {
      is: 'product',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    
    availability: Joi.object({
      inPerson: Joi.boolean().default(true),
      remote: Joi.boolean().default(false),
      locations: Joi.array().items(Joi.string()).min(1)
        .messages({
          'array.min': 'At least one location is required'
        })
    }).when('type', {
      is: 'service',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    
    features: Joi.array().items(Joi.string().trim())
      .messages({
        'array.base': 'Features must be an array'
      }),
    
    status: Joi.string().valid('draft', 'active').default('draft')
      .messages({
        'any.only': 'Status must be either "draft" or "active"'
      })
  }),

  /**
   * Validate product update
   */
  updateProduct: Joi.object({
    name: Joi.string().trim().min(3).max(100)
      .messages({
        'string.min': 'Product name must be at least 3 characters',
        'string.max': 'Product name cannot exceed 100 characters'
      }),
    
    category: Joi.string().valid(
      'handicrafts', 
      'food-products', 
      'clothing-textiles',
      'home-decor', 
      'agriculture-products', 
      'security-services', 
      'consulting-services', 
      'training-services', 
      'technical-services', 
      'other'
    )
    .messages({
      'any.only': 'Please select a valid category'
    }),
    
    description: Joi.string().trim().min(20).max(2000)
      .messages({
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 2000 characters'
      }),
    
    shortDescription: Joi.string().trim().max(200).allow('', null)
      .messages({
        'string.max': 'Short description cannot exceed 200 characters'
      }),
    
    price: Joi.object({
      amount: Joi.number().min(0)
        .messages({
          'number.min': 'Price amount cannot be negative'
        }),
      currency: Joi.string(),
      unit: Joi.string(),
      isNegotiable: Joi.boolean()
    }),
    
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required()
          .messages({
            'any.required': 'Image URL is required'
          }),
        alt: Joi.string(),
        isMain: Joi.boolean()
      })
    ),
    
    stock: Joi.object({
      available: Joi.number().integer().min(0)
        .messages({
          'number.min': 'Stock cannot be negative'
        }),
      isLimited: Joi.boolean()
    }),
    
    availability: Joi.object({
      inPerson: Joi.boolean(),
      remote: Joi.boolean(),
      locations: Joi.array().items(Joi.string()).min(1)
        .messages({
          'array.min': 'At least one location is required'
        })
    }),
    
    features: Joi.array().items(Joi.string().trim()),
    
    status: Joi.string().valid('draft', 'active', 'inactive')
      .messages({
        'any.only': 'Status must be either "draft", "active", or "inactive"'
      })
  }),

  /**
   * Validate product approval (admin function)
   */
  approveProduct: Joi.object({
    isApproved: Joi.boolean().required()
      .messages({
        'any.required': 'Approval status is required'
      }),
    
    notes: Joi.string().trim().allow('', null)
  })
};

module.exports = esmProductValidator;