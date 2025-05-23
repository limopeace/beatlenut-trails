/**
 * Blog post validation schemas
 */
const Joi = require('joi');

/**
 * Schema for creating a blog post
 */
const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must be at most 200 characters long',
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  
  slug: Joi.string().min(3).max(200).allow('').messages({
    'string.min': 'Slug must be at least 3 characters long',
    'string.max': 'Slug must be at most 200 characters long'
  }),
  
  summary: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Summary must be at least 10 characters long',
    'string.max': 'Summary must be at most 500 characters long',
    'string.empty': 'Summary is required',
    'any.required': 'Summary is required'
  }),
  
  content: Joi.string().min(50).required().messages({
    'string.min': 'Content must be at least 50 characters long',
    'string.empty': 'Content is required',
    'any.required': 'Content is required'
  }),
  
  featuredImage: Joi.object({
    url: Joi.string().required().messages({
      'string.empty': 'Featured image URL is required',
      'any.required': 'Featured image URL is required'
    }),
    alt: Joi.string().allow('').default('')
  }).required().messages({
    'any.required': 'Featured image is required'
  }),
  
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      alt: Joi.string().allow('').default(''),
      caption: Joi.string().allow('').default('')
    })
  ).default([]),
  
  category: Joi.string().valid(
    'travel', 'guides', 'culture', 'food', 'adventure', 'wildlife', 'esm', 'news', 'other'
  ).required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required',
    'any.only': 'Category must be one of: travel, guides, culture, food, adventure, wildlife, esm, news, other'
  }),
  
  tags: Joi.array().items(Joi.string().trim()).default([]),
  
  author: Joi.string().allow(null).default(null),
  
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  
  isHighlighted: Joi.boolean().default(false),
  
  publishedAt: Joi.date().allow(null).default(null),
  
  seo: Joi.object({
    metaTitle: Joi.string().max(70).allow('').default(''),
    metaDescription: Joi.string().max(160).allow('').default(''),
    keywords: Joi.array().items(Joi.string()).default([])
  }).default({
    metaTitle: '',
    metaDescription: '',
    keywords: []
  })
});

/**
 * Schema for updating a blog post
 */
const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must be at most 200 characters long'
  }),
  
  slug: Joi.string().min(3).max(200).allow('').messages({
    'string.min': 'Slug must be at least 3 characters long',
    'string.max': 'Slug must be at most 200 characters long'
  }),
  
  summary: Joi.string().min(10).max(500).messages({
    'string.min': 'Summary must be at least 10 characters long',
    'string.max': 'Summary must be at most 500 characters long'
  }),
  
  content: Joi.string().min(50).messages({
    'string.min': 'Content must be at least 50 characters long'
  }),
  
  featuredImage: Joi.object({
    url: Joi.string().required(),
    alt: Joi.string().allow('').default('')
  }),
  
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      alt: Joi.string().allow('').default(''),
      caption: Joi.string().allow('').default('')
    })
  ),
  
  category: Joi.string().valid(
    'travel', 'guides', 'culture', 'food', 'adventure', 'wildlife', 'esm', 'news', 'other'
  ).messages({
    'any.only': 'Category must be one of: travel, guides, culture, food, adventure, wildlife, esm, news, other'
  }),
  
  tags: Joi.array().items(Joi.string().trim()),
  
  isHighlighted: Joi.boolean(),
  
  seo: Joi.object({
    metaTitle: Joi.string().max(70).allow(''),
    metaDescription: Joi.string().max(160).allow(''),
    keywords: Joi.array().items(Joi.string())
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Schema for changing blog post status
 */
const changeStatusSchema = Joi.object({
  status: Joi.string().valid('draft', 'published', 'archived').required().messages({
    'string.empty': 'Status is required',
    'any.required': 'Status is required',
    'any.only': 'Status must be one of: draft, published, archived'
  })
});

/**
 * Schema for blog post query parameters
 */
const blogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  category: Joi.string().allow(''),
  tag: Joi.string().allow(''),
  search: Joi.string().allow(''),
  sortBy: Joi.string().valid('createdAt', 'publishedAt', 'title', 'views').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  isHighlighted: Joi.boolean()
});

module.exports = {
  createBlogSchema,
  updateBlogSchema,
  changeStatusSchema,
  blogQuerySchema
};