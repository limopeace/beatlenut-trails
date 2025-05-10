/**
 * Validation middleware using Joi
 */
const Joi = require('joi');
const { BadRequestError } = require('../utils/errors');

/**
 * Creates a validation middleware for the given schema
 * @param {Object} schema - Joi schema for validation
 * @param {String} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (!error) {
      return next();
    }

    const messages = error.details.map(detail => detail.message).join(', ');
    next(new BadRequestError(messages));
  };
};

module.exports = { validate };