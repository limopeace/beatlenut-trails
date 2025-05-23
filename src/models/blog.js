/**
 * Blog post model
 */
const BlogPostModel = require('./mongoose/blogPostModel');
const { NotFoundError } = require('../utils/errors');

class BlogPost {
  /**
   * Blog post constructor
   * @param {Object} data - Blog post data
   */
  constructor(data = {}) {
    this.id = data.id || data._id || null;
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.summary = data.summary || '';
    this.content = data.content || '';
    this.featuredImage = data.featuredImage || { url: '', alt: '' };
    this.images = data.images || [];
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.author = data.author || null;
    this.status = data.status || 'draft';
    this.isHighlighted = data.isHighlighted || false;
    this.publishedAt = data.publishedAt || null;
    this.views = data.views || 0;
    this.seo = data.seo || { metaTitle: '', metaDescription: '', keywords: [] };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Convert mongoose model to BlogPost instance
   * @param {Object} document - Mongoose document
   * @returns {BlogPost} BlogPost instance
   */
  static fromDocument(document) {
    if (!document) return null;
    return new BlogPost({
      id: document._id,
      title: document.title,
      slug: document.slug,
      summary: document.summary,
      content: document.content,
      featuredImage: document.featuredImage,
      images: document.images,
      category: document.category,
      tags: document.tags,
      author: document.author,
      status: document.status,
      isHighlighted: document.isHighlighted,
      publishedAt: document.publishedAt,
      views: document.views,
      seo: document.seo,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
  }

  /**
   * Convert to plain object for responses
   * @param {boolean} includeContent - Whether to include full content (default: false)
   * @returns {Object} Plain object
   */
  toJSON(includeContent = false) {
    const result = {
      id: this.id,
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      featuredImage: this.featuredImage,
      category: this.category,
      tags: this.tags,
      author: this.author,
      status: this.status,
      isHighlighted: this.isHighlighted,
      publishedAt: this.publishedAt,
      views: this.views,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (includeContent) {
      result.content = this.content;
      result.images = this.images;
      result.seo = this.seo;
    }

    return result;
  }

  /**
   * Find blog post by ID
   * @param {string} id - Blog post ID
   * @param {boolean} isPublic - If true, only return published posts
   * @returns {Promise<BlogPost|null>} Blog post or null if not found
   */
  static async findById(id, isPublic = false) {
    try {
      const query = isPublic ? { _id: id, status: 'published' } : { _id: id };
      const document = await BlogPostModel.findOne(query).populate('author', 'name email');
      
      if (!document) {
        return null;
      }
      
      return BlogPost.fromDocument(document);
    } catch (error) {
      console.error('Error finding blog post by ID:', error);
      return null;
    }
  }

  /**
   * Find blog post by slug
   * @param {string} slug - Blog post slug
   * @param {boolean} isPublic - If true, only return published posts
   * @returns {Promise<BlogPost|null>} Blog post or null if not found
   */
  static async findBySlug(slug, isPublic = false) {
    try {
      const query = isPublic ? { slug, status: 'published' } : { slug };
      const document = await BlogPostModel.findOne(query).populate('author', 'name email');
      
      if (!document) {
        return null;
      }
      
      return BlogPost.fromDocument(document);
    } catch (error) {
      console.error('Error finding blog post by slug:', error);
      return null;
    }
  }

  /**
   * Increment view count
   * @param {string} id - Blog post ID
   * @returns {Promise<boolean>} True if successful
   */
  static async incrementViews(id) {
    try {
      const result = await BlogPostModel.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
      
      return !!result;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return false;
    }
  }
}

module.exports = BlogPost;