/**
 * Example model - this is a placeholder
 * When implementing actual models, consider using Mongoose for MongoDB integration
 */
class ExampleModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.createdAt = data.createdAt || new Date();
  }

  validate() {
    if (!this.name) {
      throw new Error('Name is required');
    }
    return true;
  }

  // Example static method
  static findById(id) {
    // In a real implementation, this would query a database
    return Promise.resolve(new ExampleModel({ id, name: 'Example', createdAt: new Date() }));
  }
}

module.exports = ExampleModel;