const ExampleService = require('../services/exampleService');
const { NotFoundError } = require('../utils/errors');

// Create an instance of the service
const exampleService = new ExampleService();

/**
 * Example controller with common CRUD operations
 */
const exampleController = {
  // Get all examples
  getAll: async (req, res, next) => {
    try {
      const examples = await exampleService.findAll();
      return res.json({
        status: 'success',
        results: examples.length,
        data: examples
      });
    } catch (error) {
      next(error);
    }
  },

  // Get example by ID
  getById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const example = await exampleService.findById(id);
      
      if (!example) {
        return next(new NotFoundError('Example not found'));
      }
      
      return res.json({
        status: 'success',
        data: example
      });
    } catch (error) {
      next(error);
    }
  },

  // Create example
  create: async (req, res, next) => {
    try {
      const example = await exampleService.create(req.body);
      
      return res.status(201).json({
        status: 'success',
        data: example
      });
    } catch (error) {
      // The validation middleware will catch validation errors before they reach here
      next(error);
    }
  }
};

module.exports = exampleController;