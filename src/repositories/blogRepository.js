/**
 * Blog post repository for database operations
 */
const BlogPostModel = require('../models/mongoose/blogPostModel');
const BlogPost = require('../models/blog');
const { NotFoundError } = require('../utils/errors');

class BlogRepository {
  /**
   * Create a new blog post
   * @param {Object} blogData - Blog data
   * @returns {Promise<Object>} Created blog post
   */
  async create(blogData) {
    const blogPost = await BlogPostModel.create(blogData);
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Find blog post by ID
   * @param {String} id - Blog post ID
   * @param {Boolean} isPublic - Only return published posts if true
   * @returns {Promise<Object>} Blog post
   */
  async findById(id, isPublic = false) {
    const query = isPublic ? { _id: id, status: 'published' } : { _id: id };
    const blogPost = await BlogPostModel.findOne(query).populate('author', 'name email');
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Find blog post by slug
   * @param {String} slug - Blog post slug
   * @param {Boolean} isPublic - Only return published posts if true
   * @returns {Promise<Object>} Blog post
   */
  async findBySlug(slug, isPublic = false) {
    const query = isPublic ? { slug, status: 'published' } : { slug };
    const blogPost = await BlogPostModel.findOne(query).populate('author', 'name email');
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Get all blog posts with pagination and filtering
   * @param {Object} options - Query options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Items per page (default: 10)
   * @param {String} options.category - Filter by category
   * @param {String} options.tag - Filter by tag
   * @param {String} options.search - Search term
   * @param {String} options.sortBy - Sort field (default: createdAt)
   * @param {String} options.sortOrder - Sort order (default: desc)
   * @param {Boolean} options.isPublic - Only return published posts if true
   * @returns {Promise<Object>} Paginated blog posts
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isPublic = false,
      isHighlighted
    } = options;
    
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };
    
    // Build query
    const query = isPublic ? { status: 'published' } : {};
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (isHighlighted !== undefined) {
      query.isHighlighted = isHighlighted;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute query with pagination
    const [blogPosts, total] = await Promise.all([
      BlogPostModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email'),
      BlogPostModel.countDocuments(query)
    ]);
    
    // Map to domain objects
    const items = blogPosts.map(post => BlogPost.fromDocument(post));
    
    return {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update blog post
   * @param {String} id - Blog post ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated blog post
   */
  async update(id, updateData) {
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Delete blog post
   * @param {String} id - Blog post ID
   * @returns {Promise<Object>} Deleted blog post
   */
  async delete(id) {
    const blogPost = await BlogPostModel.findByIdAndDelete(id);
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Increment view count
   * @param {String} id - Blog post ID
   * @returns {Promise<Object>} Updated blog post
   */
  async incrementViews(id) {
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email');
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Change blog post status
   * @param {String} id - Blog post ID
   * @param {String} status - New status (draft, published, archived)
   * @returns {Promise<Object>} Updated blog post
   */
  async changeStatus(id, status) {
    const updateData = {
      status
    };
    
    // Set publishedAt date if status is changed to published
    if (status === 'published') {
      updateData.publishedAt = updateData.publishedAt || new Date();
    }
    
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    
    return BlogPost.fromDocument(blogPost);
  }

  /**
   * Get related blog posts
   * @param {String} blogId - Current blog post ID
   * @param {Array} tags - Tags to match
   * @param {String} category - Category to match
   * @param {Number} limit - Number of posts to return (default: 3)
   * @returns {Promise<Array>} Related blog posts
   */
  async getRelatedPosts(blogId, tags = [], category, limit = 3) {
    const query = {
      _id: { $ne: blogId },
      status: 'published'
    };
    
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (category) {
      query.category = category;
    }
    
    const blogPosts = await BlogPostModel.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('author', 'name email');
    
    return blogPosts.map(post => BlogPost.fromDocument(post));
  }
}

module.exports = BlogRepository;