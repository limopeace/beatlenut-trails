const ESMService = require('../models/esmService');
const { getServiceRepository } = require('../repositories/esmServiceRepository');
const { validationResult } = require('express-validator');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * Get all services with optional filtering
 */
exports.getAllServices = async (req, res, next) => {
  try {
    const { sellerId, category, featured, status, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (sellerId) filters.seller = sellerId;
    if (category) filters.category = category;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (status) filters.status = status;
    
    // Only show active services for public requests
    if (!req.user) {
      filters.status = 'active';
    }
    
    const repository = getServiceRepository();
    const services = await repository.findAll(filters, { limit: parseInt(limit), skip });
    const total = await repository.count(filters);
    
    res.status(200).json({
      success: true,
      data: {
        services,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a service by ID
 */
exports.getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getServiceRepository();
    
    const service = await repository.findById(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }
    
    // Only allow viewing inactive services if user is the owner
    if (service.status === 'inactive' && (!req.user || req.user.id !== service.seller.toString())) {
      throw new NotFoundError('Service not found');
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new service
 */
exports.createService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation failed', errors.array());
    }
    
    const {
      name, basePrice, category, description,
      duration, location, tags, featured, images, packages
    } = req.body;
    
    // Validate required fields
    if (!name || !basePrice || !category || !description || !location || !images || !images.length || !packages || !packages.length) {
      throw new BadRequestError('Missing required fields');
    }
    
    // Validate packages
    for (const pkg of packages) {
      if (!pkg.name || !pkg.description || !pkg.price) {
        throw new BadRequestError('Each package must have a name, description, and price');
      }
    }
    
    const repository = getServiceRepository();
    
    const serviceData = {
      name,
      basePrice,
      category,
      description,
      duration,
      location,
      tags,
      featured: featured || false,
      images,
      packages,
      seller: req.user.id,
      status: 'active'
    };
    
    const service = await repository.create(serviceData);
    
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a service
 */
exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getServiceRepository();
    
    // Find the service
    const service = await repository.findById(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }
    
    // Check if the user is the owner
    if (service.seller.toString() !== req.user.id) {
      throw new ForbiddenError('You do not have permission to update this service');
    }
    
    // Update service data
    const updates = {};
    const allowedFields = [
      'name', 'basePrice', 'category', 'description', 'duration',
      'location', 'tags', 'featured', 'status', 'images', 'packages'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    // Validate packages if updating
    if (updates.packages) {
      for (const pkg of updates.packages) {
        if (!pkg.name || !pkg.description || !pkg.price) {
          throw new BadRequestError('Each package must have a name, description, and price');
        }
      }
    }
    
    const updatedService = await repository.update(id, updates);
    
    res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a service
 */
exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getServiceRepository();
    
    // Find the service
    const service = await repository.findById(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }
    
    // Check if the user is the owner
    if (service.seller.toString() !== req.user.id) {
      throw new ForbiddenError('You do not have permission to delete this service');
    }
    
    await repository.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all services by seller ID
 */
exports.getServicesBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const repository = getServiceRepository();
    
    // Check if requesting own services
    const isOwner = req.user && req.user.id === sellerId;
    
    // If not the owner, only show active services
    const filters = { seller: sellerId };
    if (!isOwner) {
      filters.status = 'active';
    }
    
    const services = await repository.findAll(filters);
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured services
 */
exports.getFeaturedServices = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const repository = getServiceRepository();
    
    const services = await repository.findAll({
      featured: true,
      status: 'active'
    }, { limit: parseInt(limit) });
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};