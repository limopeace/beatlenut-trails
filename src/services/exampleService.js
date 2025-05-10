/**
 * Example service layer for business logic
 */
class ExampleService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Find all examples
   * @returns {Promise<Array>} Array of examples
   */
  async findAll() {
    // In a real implementation, this would use the repository to get data
    return Promise.resolve([
      { id: 1, name: 'Example 1', createdAt: new Date() },
      { id: 2, name: 'Example 2', createdAt: new Date() }
    ]);
  }

  /**
   * Find example by ID
   * @param {string|number} id - Example ID
   * @returns {Promise<Object|null>} Example object or null if not found
   */
  async findById(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    // In a real implementation, this would use the repository to get data
    return Promise.resolve({ id, name: 'Example', createdAt: new Date() });
  }

  /**
   * Create new example
   * @param {Object} data - Example data
   * @returns {Promise<Object>} Created example
   */
  async create(data) {
    if (!data || !data.name) {
      throw new Error('Name is required');
    }
    
    // In a real implementation, this would use the repository to save data
    const newExample = {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      createdAt: new Date()
    };
    
    return Promise.resolve(newExample);
  }
}

module.exports = ExampleService;