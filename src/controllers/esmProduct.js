const ESMProduct = require('../models/esmProduct');
const esmProductRepository = require('../repositories/esmProductRepository');
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
    
    const result = await ESMProduct.getAll(filters, parseInt(page), parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: result
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
    
    const product = await ESMProduct.findById(id);
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
    
    const product = await ESMProduct.create(productData);
    
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
    
    // Find the product
    const product = await ESMProduct.findById(id);
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
    
    const updatedProduct = await ESMProduct.update(id, updates);
    
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
    
    // Find the product
    const product = await ESMProduct.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Check if the user is the owner
    if (product.seller.toString() !== req.user.id) {
      throw new ForbiddenError('You do not have permission to delete this product');
    }
    
    await ESMProduct.delete(id);
    
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
    
    // Check if requesting own products
    const isOwner = req.user && req.user.id === sellerId;
    
    // If not the owner, only show active products
    const filters = { seller: sellerId };
    if (!isOwner) {
      filters.status = 'active';
    }
    
    const products = await ESMProduct.getAll(filters);
    
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
    
    const products = await ESMProduct.getAll({
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
/**
 * Upload product image
 */
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new BadRequestError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }

    // For now, we'll just return a mock URL
    // In production, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    const imageUrl = `/uploads/products/${Date.now()}-${req.file.originalname}`;
    
    res.status(200).json({
      success: true,
      data: {
        url: imageUrl
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};