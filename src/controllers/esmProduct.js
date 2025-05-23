const ESMProduct = require('../models/esmProduct');
const { getProductRepository } = require('../repositories/esmProductRepository');
const { validationResult } = require('express-validator');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * Get all products with optional filtering
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { sellerId, category, featured, status, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (sellerId) filters.seller = sellerId;
    if (category) filters.category = category;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (status) filters.status = status;
    
    // Only show active products for public requests
    if (!req.user) {
      filters.status = 'active';
    }
    
    const repository = getProductRepository();
    const products = await repository.findAll(filters, { limit: parseInt(limit), skip });
    const total = await repository.count(filters);
    
    res.status(200).json({
      success: true,
      data: {
        products,
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
 * Get a product by ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getProductRepository();
    
    const product = await repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Only allow viewing inactive products if user is the owner
    if (product.status === 'inactive' && (!req.user || req.user.id !== product.seller.toString())) {
      throw new NotFoundError('Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 */
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation failed', errors.array());
    }
    
    const {
      name, price, salePrice, category, description,
      stock, weight, dimensions, tags, featured, images
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !category || !description || !images || !images.length) {
      throw new BadRequestError('Missing required fields');
    }
    
    const repository = getProductRepository();
    
    const productData = {
      name,
      price,
      salePrice,
      category,
      description,
      stock: stock || 1,
      weight,
      dimensions,
      tags,
      featured: featured || false,
      images,
      seller: req.user.id,
      status: 'active'
    };
    
    const product = await repository.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getProductRepository();
    
    // Find the product
    const product = await repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Check if the user is the owner
    if (product.seller.toString() !== req.user.id) {
      throw new ForbiddenError('You do not have permission to update this product');
    }
    
    // Update product data
    const updates = {};
    const allowedFields = [
      'name', 'price', 'salePrice', 'category', 'description',
      'stock', 'weight', 'dimensions', 'tags', 'featured', 'status', 'images'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const updatedProduct = await repository.update(id, updates);
    
    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repository = getProductRepository();
    
    // Find the product
    const product = await repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Check if the user is the owner
    if (product.seller.toString() !== req.user.id) {
      throw new ForbiddenError('You do not have permission to delete this product');
    }
    
    await repository.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products by seller ID
 */
exports.getProductsBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const repository = getProductRepository();
    
    // Check if requesting own products
    const isOwner = req.user && req.user.id === sellerId;
    
    // If not the owner, only show active products
    const filters = { seller: sellerId };
    if (!isOwner) {
      filters.status = 'active';
    }
    
    const products = await repository.findAll(filters);
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const repository = getProductRepository();
    
    const products = await repository.findAll({
      featured: true,
      status: 'active'
    }, { limit: parseInt(limit) });
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};