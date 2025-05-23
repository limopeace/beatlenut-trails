/**
 * Blog service for handling blog post operations
 */
const BlogRepository = require('../repositories/blogRepository');
const FileUploadService = require('./fileUploadService');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

class BlogService {
  constructor() {
    this.blogRepository = new BlogRepository();
    this.fileUploadService = new FileUploadService();
  }

  /**
   * Create a new blog post
   * @param {Object} blogData - Blog post data
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Created blog post
   */
  async createBlogPost(blogData, user) {
    try {
      // Set author to current user if not provided
      if (!blogData.author) {
        blogData.author = user.id;
      }
      
      // Only admins can create posts for other users
      if (blogData.author !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('You are not authorized to create blog posts for other users');
      }

      // Create the blog post
      const blogPost = await this.blogRepository.create(blogData);
      
      return blogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Get blog post by ID
   * @param {String} id - Blog post ID
   * @param {Object} user - Current user (optional)
   * @returns {Promise<Object>} Blog post
   */
  async getBlogPostById(id, user = null) {
    try {
      // Determine if this is a public request (no user or non-admin)
      const isPublic = !user || user.role !== 'admin';
      
      const blogPost = await this.blogRepository.findById(id, isPublic);
      
      if (isPublic) {
        // Increment view count for public requests
        await this.blogRepository.incrementViews(id);
      }
      
      return blogPost;
    } catch (error) {
      console.error('Error getting blog post by ID:', error);
      throw error;
    }
  }

  /**
   * Get blog post by slug
   * @param {String} slug - Blog post slug
   * @param {Object} user - Current user (optional)
   * @returns {Promise<Object>} Blog post
   */
  async getBlogPostBySlug(slug, user = null) {
    try {
      // Determine if this is a public request (no user or non-admin)
      const isPublic = !user || user.role !== 'admin';
      
      const blogPost = await this.blogRepository.findBySlug(slug, isPublic);
      
      if (isPublic && blogPost) {
        // Increment view count for public requests
        await this.blogRepository.incrementViews(blogPost.id);
      }
      
      return blogPost;
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      throw error;
    }
  }

  /**
   * Get all blog posts with pagination and filtering
   * @param {Object} options - Query options
   * @param {Object} user - Current user (optional)
   * @returns {Promise<Object>} Paginated blog posts
   */
  async getAllBlogPosts(options = {}, user = null) {
    try {
      // Determine if this is a public request (no user or non-admin)
      const isPublic = !user || user.role !== 'admin';
      
      // Add isPublic to options
      options.isPublic = isPublic;
      
      return await this.blogRepository.findAll(options);
    } catch (error) {
      console.error('Error getting all blog posts:', error);
      throw error;
    }
  }

  /**
   * Update blog post
   * @param {String} id - Blog post ID
   * @param {Object} updateData - Data to update
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Updated blog post
   */
  async updateBlogPost(id, updateData, user) {
    try {
      // Get existing blog post
      const existingPost = await this.blogRepository.findById(id);
      
      // Check if user is authorized to update this post
      if (existingPost.author.toString() !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('You are not authorized to update this blog post');
      }
      
      // Update blog post
      const updatedPost = await this.blogRepository.update(id, updateData);
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete blog post
   * @param {String} id - Blog post ID
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Deleted blog post
   */
  async deleteBlogPost(id, user) {
    try {
      // Get existing blog post
      const existingPost = await this.blogRepository.findById(id);
      
      // Check if user is authorized to delete this post
      if (existingPost.author.toString() !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('You are not authorized to delete this blog post');
      }
      
      // Delete blog post
      const deletedPost = await this.blogRepository.delete(id);
      
      // Delete associated files if needed
      if (deletedPost.featuredImage && deletedPost.featuredImage.url) {
        await this.fileUploadService.deleteFile(deletedPost.featuredImage.url);
      }
      
      if (deletedPost.images && deletedPost.images.length > 0) {
        await Promise.all(deletedPost.images.map(image => 
          this.fileUploadService.deleteFile(image.url)
        ));
      }
      
      return deletedPost;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Change blog post status
   * @param {String} id - Blog post ID
   * @param {String} status - New status (draft, published, archived)
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Updated blog post
   */
  async changeBlogPostStatus(id, status, user) {
    try {
      if (!['draft', 'published', 'archived'].includes(status)) {
        throw new BadRequestError('Invalid status');
      }
      
      // Get existing blog post
      const existingPost = await this.blogRepository.findById(id);
      
      // Check if user is authorized to change status
      // Only post author or admin can change status
      if (existingPost.author.toString() !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('You are not authorized to change the status of this blog post');
      }
      
      // Change blog post status
      const updatedPost = await this.blogRepository.changeStatus(id, status);
      
      return updatedPost;
    } catch (error) {
      console.error('Error changing blog post status:', error);
      throw error;
    }
  }

  /**
   * Upload blog post image
   * @param {Object} file - File object
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Uploaded image information
   */
  async uploadBlogImage(file, user) {
    try {
      // Check if user is authenticated
      if (!user) {
        throw new UnauthorizedError('Authentication required');
      }
      
      // Upload image
      const uploadedFile = await this.fileUploadService.uploadFile(file, 'blog');
      
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading blog image:', error);
      throw error;
    }
  }

  /**
   * Get related blog posts
   * @param {String} blogId - Current blog post ID
   * @param {Array} tags - Tags to match
   * @param {String} category - Category to match
   * @param {Number} limit - Number of posts to return
   * @returns {Promise<Array>} Related blog posts
   */
  async getRelatedPosts(blogId, tags = [], category, limit = 3) {
    try {
      return await this.blogRepository.getRelatedPosts(blogId, tags, category, limit);
    } catch (error) {
      console.error('Error getting related posts:', error);
      throw error;
    }
  }

  /**
   * Get highlighted blog posts
   * @param {Number} limit - Number of posts to return
   * @returns {Promise<Array>} Highlighted blog posts
   */
  async getHighlightedPosts(limit = 3) {
    try {
      const result = await this.blogRepository.findAll({
        isPublic: true,
        isHighlighted: true,
        limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      
      return result.items;
    } catch (error) {
      console.error('Error getting highlighted posts:', error);
      throw error;
    }
  }
}

module.exports = BlogService;