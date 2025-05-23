/**
 * Validation schema for contact form
 */
const Joi = require('joi');

/**
 * Schema for contact form validation
 */
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be at most 100 characters long',
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  
  phone: Joi.string().allow('').optional(),
  
  subject: Joi.string().allow('').max(200).optional().messages({
    'string.max': 'Subject must be at most 200 characters long'
  }),
  
  message: Joi.string().min(10).required().messages({
    'string.min': 'Message must be at least 10 characters long',
    'string.empty': 'Message is required',
    'any.required': 'Message is required'
  })
});

module.exports = contactSchema;