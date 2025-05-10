/**
 * Example repository for database operations
 */
const ExampleModel = require('../models/mongoose/exampleModel');
const { NotFoundError } = require('../utils/errors');

class ExampleRepository {
  /**
   * Find all examples
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} List of examples
   */
  async findAll(filter = {}) {
    return await ExampleModel.find(filter).sort({ createdAt: -1 });
  }

  /**
   * Find example by ID
   * @param {String} id - Example ID
   * @returns {Promise<Object>} Example
   */
  async findById(id) {
    const example = await ExampleModel.findById(id);
    
    if (!example) {
      throw new NotFoundError('Example not found');
    }
    
    return example;
  }

  /**
   * Create a new example
   * @param {Object} data - Example data
   * @returns {Promise<Object>} Created example
   */
  async create(data) {
    return await ExampleModel.create(data);
  }

  /**
   * Update example
   * @param {String} id - Example ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated example
   */
  async update(id, updateData) {
    const example = await ExampleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!example) {
      throw new NotFoundError('Example not found');
    }
    
    return example;
  }

  /**
   * Delete example
   * @param {String} id - Example ID
   * @returns {Promise<Object>} Deleted example
   */
  async delete(id) {
    const example = await ExampleModel.findByIdAndDelete(id);
    
    if (!example) {
      throw new NotFoundError('Example not found');
    }
    
    return example;
  }

  /**
   * Find examples by name
   * @param {String} name - Name to search for
   * @returns {Promise<Array>} List of examples
   */
  async findByName(name) {
    return await ExampleModel.findByName(name);
  }
}

module.exports = ExampleRepository;