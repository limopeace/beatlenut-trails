/**
 * Validation schemas for example routes
 */
const Joi = require('joi');

/**
 * Schema for creating a new example
 */
const createExampleSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 100 characters long',
    'any.required': 'Name is required'
  }),
  
  description: Joi.string().allow('').optional().max(500).messages({
    'string.max': 'Description must be at most 500 characters long'
  })
});

/**
 * Schema for getting an example by ID
 */
const getExampleByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Example ID is required',
    'any.required': 'Example ID is required'
  })
});

module.exports = {
  createExampleSchema,
  getExampleByIdSchema
};