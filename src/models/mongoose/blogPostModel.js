/**
 * Mongoose model for blog posts
 */
const mongoose = require('mongoose');

/**
 * Blog post schema
 */
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title must be at most 200 characters long']
  },
  
  slug: {
    type: String,
    required: [true, 'Blog post slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  
  summary: {
    type: String,
    required: [true, 'Blog post summary is required'],
    trim: true,
    maxlength: [500, 'Summary must be at most 500 characters long']
  },
  
  content: {
    type: String,
    required: [true, 'Blog post content is required']
  },
  
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Featured image URL is required']
    },
    alt: {
      type: String,
      default: ''
    }
  },
  
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    }
  }],
  
  category: {
    type: String,
    required: [true, 'Blog post category is required'],
    enum: ['travel', 'guides', 'culture', 'food', 'adventure', 'wildlife', 'esm', 'news', 'other']
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog post author is required']
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  isHighlighted: {
    type: Boolean,
    default: false
  },
  
  publishedAt: {
    type: Date,
    default: null
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title must be at most 70 characters long']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description must be at most 160 characters long']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reading time estimate
blogPostSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Create text index for search functionality
blogPostSchema.index({ 
  title: 'text', 
  summary: 'text', 
  content: 'text', 
  tags: 'text' 
});

// Pre-save hook to auto-generate slug if not provided
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  if (!this.slug) {
    // Create slug from title
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
  
  // Update publishedAt if status changed to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;