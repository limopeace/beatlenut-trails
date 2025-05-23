/**
 * Blog controller
 */
const BlogService = require('../services/blogService');
const FileUploadService = require('../services/fileUploadService');
const { blogQuerySchema } = require('../validators/blog');
const { BadRequestError } = require('../utils/errors');

const blogService = new BlogService();
const fileUploadService = new FileUploadService();

const blogController = {
  /**
   * Create a new blog post
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createBlogPost: async (req, res, next) => {
    try {
      const blogPost = await blogService.createBlogPost(req.body, req.user);
      
      res.status(201).json({
        status: 'success',
        data: blogPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all blog posts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllBlogPosts: async (req, res, next) => {
    try {
      // Validate and parse query parameters
      const { error, value } = blogQuerySchema.validate(req.query);
      if (error) {
        throw new BadRequestError(error.message);
      }
      
      // Convert string parameters to correct types
      const options = value;
      if (options.isHighlighted !== undefined) {
        options.isHighlighted = options.isHighlighted === 'true';
      }
      
      const result = await blogService.getAllBlogPosts(options, req.user);
      
      res.json({
        status: 'success',
        data: result.items,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get highlighted blog posts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getHighlightedPosts: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 3;
      const posts = await blogService.getHighlightedPosts(limit);
      
      res.json({
        status: 'success',
        data: posts
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get blog post by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getBlogPostById: async (req, res, next) => {
    try {
      const blogPost = await blogService.getBlogPostById(req.params.id, req.user);
      
      res.json({
        status: 'success',
        data: blogPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get blog post by slug
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getBlogPostBySlug: async (req, res, next) => {
    try {
      const blogPost = await blogService.getBlogPostBySlug(req.params.slug, req.user);
      
      res.json({
        status: 'success',
        data: blogPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update blog post
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateBlogPost: async (req, res, next) => {
    try {
      const blogPost = await blogService.updateBlogPost(
        req.params.id,
        req.body,
        req.user
      );
      
      res.json({
        status: 'success',
        data: blogPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete blog post
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteBlogPost: async (req, res, next) => {
    try {
      await blogService.deleteBlogPost(req.params.id, req.user);
      
      res.json({
        status: 'success',
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Change blog post status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  changeBlogPostStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const blogPost = await blogService.changeBlogPostStatus(
        req.params.id,
        status,
        req.user
      );
      
      res.json({
        status: 'success',
        data: blogPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get related blog posts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getRelatedPosts: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { tags, category, limit } = req.query;
      
      // Parse tags if provided
      const tagArray = tags ? tags.split(',') : [];
      
      // Parse limit if provided
      const limitValue = limit ? parseInt(limit) : 3;
      
      const posts = await blogService.getRelatedPosts(id, tagArray, category, limitValue);
      
      res.json({
        status: 'success',
        data: posts
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upload blog post image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  uploadBlogImage: async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }
      
      const result = await blogService.uploadBlogImage(req.file, req.user);
      
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = blogController;