const Joi = require('joi');

/**
 * Validation schemas for ESM Seller operations
 */
const esmSellerValidator = {
  /**
   * Validate seller registration
   */
  register: Joi.object({
    fullName: Joi.string().trim().min(3).max(100).required()
      .messages({
        'string.min': 'Full name must be at least 3 characters',
        'string.max': 'Full name cannot exceed 100 characters',
        'any.required': 'Full name is required'
      }),
    
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      }),
    
    phone: Joi.string().trim().required()
      .pattern(new RegExp('^\\+?[0-9]{10,15}$'))
      .messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'any.required': 'Phone number is required'
      }),
    
    location: Joi.string().trim().required()
      .messages({
        'any.required': 'Location is required'
      }),
    
    serviceBranch: Joi.string().valid('army', 'navy', 'airforce', 'coast-guard', 'other').required()
      .messages({
        'any.only': 'Please select a valid service branch',
        'any.required': 'Service branch is required'
      }),
    
    rank: Joi.string().trim().required()
      .messages({
        'any.required': 'Rank is required'
      }),
    
    serviceNumber: Joi.string().trim().required()
      .messages({
        'any.required': 'Service number is required'
      }),
    
    serviceYears: Joi.object({
      from: Joi.number().integer().min(1947).max(new Date().getFullYear()).required()
        .messages({
          'number.min': 'Service start year must be 1947 or later',
          'number.max': 'Service start year cannot be in the future',
          'any.required': 'Service start year is required'
        }),
      to: Joi.number().integer().min(1947).max(new Date().getFullYear()).required()
        .messages({
          'number.min': 'Service end year must be 1947 or later',
          'number.max': 'Service end year cannot be in the future',
          'any.required': 'Service end year is required'
        })
    }).required()
      .messages({
        'any.required': 'Service years are required'
      }),
    
    businessName: Joi.string().trim().allow('', null),
    
    sellerType: Joi.object({
      products: Joi.boolean().default(false),
      services: Joi.boolean().default(false)
    }).custom((value, helpers) => {
      if (!value.products && !value.services) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.invalid': 'You must select at least one seller type (products or services)'
    }),
    
    category: Joi.string().valid(
      'handicrafts', 
      'food-products', 
      'security-services', 
      'consulting', 
      'training', 
      'agriculture', 
      'technical-services', 
      'other'
    ).required()
    .messages({
      'any.only': 'Please select a valid category',
      'any.required': 'Category is required'
    }),
    
    description: Joi.string().trim().min(20).max(1000).required()
      .messages({
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 1000 characters',
        'any.required': 'Description is required'
      }),
    
    verificationDocument: Joi.string().required()
      .messages({
        'any.required': 'Verification document is required'
      })
  }),

  /**
   * Validate seller login
   */
  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  /**
   * Validate seller profile update
   */
  updateProfile: Joi.object({
    fullName: Joi.string().trim().min(3).max(100)
      .messages({
        'string.min': 'Full name must be at least 3 characters',
        'string.max': 'Full name cannot exceed 100 characters'
      }),
    
    phone: Joi.string().trim()
      .pattern(new RegExp('^\\+?[0-9]{10,15}$'))
      .messages({
        'string.pattern.base': 'Please enter a valid phone number'
      }),
    
    location: Joi.string().trim(),
    
    businessName: Joi.string().trim().allow('', null),
    
    sellerType: Joi.object({
      products: Joi.boolean(),
      services: Joi.boolean()
    }).custom((value, helpers) => {
      if (value && !value.products && !value.services) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.invalid': 'You must select at least one seller type (products or services)'
    }),
    
    category: Joi.string().valid(
      'handicrafts', 
      'food-products', 
      'security-services', 
      'consulting', 
      'training', 
      'agriculture', 
      'technical-services', 
      'other'
    )
    .messages({
      'any.only': 'Please select a valid category'
    }),
    
    description: Joi.string().trim().min(20).max(1000)
      .messages({
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 1000 characters'
      })
  }),

  /**
   * Validate change password
   */
  changePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required'
      })
  }),

  /**
   * Validate seller verification (admin function)
   */
  verifySeller: Joi.object({
    isVerified: Joi.boolean().required()
      .messages({
        'any.required': 'Verification status is required'
      }),
    
    notes: Joi.string().trim().allow('', null),
    
    status: Joi.string().valid('pending', 'active', 'suspended', 'rejected')
      .messages({
        'any.only': 'Please select a valid status'
      })
  })
};

module.exports = esmSellerValidator;