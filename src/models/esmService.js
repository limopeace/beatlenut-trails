/**
 * ESM Service model
 */
class ESMService {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.basePrice = data.basePrice || 0;
    this.category = data.category || '';
    this.description = data.description || '';
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.tags = data.tags || [];
    this.featured = data.featured || false;
    this.images = data.images || [];
    this.packages = data.packages || [];
    this.seller = data.seller || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // This is a stub model. Actual functionality would connect to a database
  // or another data store.
}

module.exports = ESMService;