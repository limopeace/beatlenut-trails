const ExampleService = require('../services/exampleService');

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
      return res.json(examples);
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
        return res.status(404).json({ message: 'Example not found' });
      }

      return res.json(example);
    } catch (error) {
      next(error);
    }
  },

  // Create example
  create: async (req, res, next) => {
    try {
      const example = await exampleService.create(req.body);
      return res.status(201).json(example);
    } catch (error) {
      if (error.message === 'Name is required') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
};

module.exports = exampleController;