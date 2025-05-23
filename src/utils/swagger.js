/**
 * Swagger configuration
 */
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Beatlenuts-GR API',
    version: '1.0.0',
    description: 'Beatlenuts-GR REST API documentation',
    contact: {
      name: 'API Support',
      url: 'https://example.com/support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Examples',
      description: 'Example resource endpoints',
    },
    {
      name: 'Contact',
      description: 'Contact form endpoints',
    },
    {
      name: 'Blog',
      description: 'Blog management endpoints',
    },
    {
      name: 'ESM Sellers',
      description: 'Ex-Servicemen seller endpoints',
    },
    {
      name: 'ESM Products',
      description: 'Ex-Servicemen products and services endpoints',
    },
    {
      name: 'ESM Reviews',
      description: 'Product and seller review endpoints',
    },
    {
      name: 'Bike Rentals',
      description: 'Motorcycle rental endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
        },
      },
      Example: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Example ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'Example name',
            example: 'Test Example',
          },
          description: {
            type: 'string',
            description: 'Example description',
            example: 'This is a test example',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
            example: '2023-06-30T12:53:40.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
            example: '2023-06-30T12:53:40.000Z',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john@example.com',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role',
            example: 'user',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
            example: '2023-06-30T12:53:40.000Z',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password',
            example: 'Password123',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              token: {
                type: 'string',
                description: 'JWT token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password',
            example: 'Password123',
          },
        },
      },
      ESMSeller: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Seller ID',
            example: '60d21b4667d0d8992e610c85',
          },
          fullName: {
            type: 'string',
            description: 'Full name of the seller',
            example: 'Major John Smith',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address',
            example: 'john.smith@example.com',
          },
          phone: {
            type: 'string',
            description: 'Contact phone number',
            example: '+91 9876543210',
          },
          location: {
            type: 'string',
            description: 'Location of the seller',
            example: 'New Delhi, India',
          },
          serviceBranch: {
            type: 'string',
            enum: ['army', 'navy', 'airforce', 'coast-guard', 'other'],
            description: 'Military branch served in',
            example: 'army',
          },
          rank: {
            type: 'string',
            description: 'Military rank',
            example: 'Major',
          },
          serviceNumber: {
            type: 'string',
            description: 'Military service number',
            example: 'IND/12345/A',
          },
          serviceYears: {
            type: 'object',
            properties: {
              from: {
                type: 'number',
                description: 'Year service started',
                example: 1995,
              },
              to: {
                type: 'number',
                description: 'Year service ended',
                example: 2015,
              },
            },
          },
          businessName: {
            type: 'string',
            description: 'Name of the business',
            example: 'Smith Security Services',
          },
          sellerType: {
            type: 'object',
            properties: {
              products: {
                type: 'boolean',
                description: 'Seller offers products',
                example: true,
              },
              services: {
                type: 'boolean',
                description: 'Seller offers services',
                example: true,
              },
            },
          },
          category: {
            type: 'string',
            description: 'Main business category',
            example: 'Security Services',
          },
          description: {
            type: 'string',
            description: 'Business description',
            example: 'Professional security services for homes and businesses',
          },
          isVerified: {
            type: 'boolean',
            description: 'Verification status',
            example: true,
          },
          status: {
            type: 'string',
            enum: ['pending', 'active', 'suspended', 'rejected'],
            description: 'Account status',
            example: 'active',
          },
          ratings: {
            type: 'object',
            properties: {
              average: {
                type: 'number',
                description: 'Average rating (1-5)',
                example: 4.5,
              },
              count: {
                type: 'number',
                description: 'Number of ratings',
                example: 27,
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation date',
            example: '2023-06-30T12:53:40.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
            example: '2023-07-15T09:22:15.000Z',
          },
        },
      },
      ESMProduct: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
            example: '60d21b4667d0d8992e610c85',
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Home Security System',
          },
          seller: {
            type: 'string',
            description: 'Seller ID',
            example: '60d21b4667d0d8992e610c86',
          },
          category: {
            type: 'string',
            description: 'Product category',
            example: 'Security Systems',
          },
          type: {
            type: 'string',
            enum: ['product', 'service'],
            description: 'Type of offering',
            example: 'product',
          },
          description: {
            type: 'string',
            description: 'Detailed product description',
            example: 'Complete home security system with 4 cameras, motion sensors, and 24/7 monitoring.',
          },
          shortDescription: {
            type: 'string',
            description: 'Short description for listings',
            example: 'Complete home security system with professional installation.',
          },
          price: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'Price amount',
                example: 20000,
              },
              currency: {
                type: 'string',
                description: 'Currency code',
                example: 'INR',
              },
              unit: {
                type: 'string',
                description: 'Pricing unit',
                example: 'flat',
              },
              isNegotiable: {
                type: 'boolean',
                description: 'Whether price is negotiable',
                example: false,
              },
            },
          },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Image URL',
                  example: 'https://example.com/images/product1.jpg',
                },
                alt: {
                  type: 'string',
                  description: 'Alt text',
                  example: 'Home security system with cameras',
                },
                isMain: {
                  type: 'boolean',
                  description: 'Whether this is the main product image',
                  example: true,
                },
              },
            },
          },
          stock: {
            type: 'object',
            properties: {
              available: {
                type: 'number',
                description: 'Available quantity',
                example: 10,
              },
              isLimited: {
                type: 'boolean',
                description: 'Whether stock is limited',
                example: true,
              },
            },
          },
          availability: {
            type: 'object',
            properties: {
              inPerson: {
                type: 'boolean',
                description: 'Available in-person',
                example: true,
              },
              remote: {
                type: 'boolean',
                description: 'Available remotely',
                example: false,
              },
              locations: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Service locations',
                example: ['Delhi', 'Gurgaon', 'Noida'],
              },
            },
          },
          features: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Product features',
            example: ['24/7 Monitoring', 'Mobile App', 'Motion Detection'],
          },
          status: {
            type: 'string',
            enum: ['draft', 'active', 'inactive', 'rejected'],
            description: 'Product status',
            example: 'active',
          },
          isApproved: {
            type: 'boolean',
            description: 'Admin approval status',
            example: true,
          },
          views: {
            type: 'number',
            description: 'Number of views',
            example: 150,
          },
          ratings: {
            type: 'object',
            properties: {
              average: {
                type: 'number',
                description: 'Average rating (1-5)',
                example: 4.7,
              },
              count: {
                type: 'number',
                description: 'Number of ratings',
                example: 12,
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
            example: '2023-06-30T12:53:40.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
            example: '2023-07-15T09:22:15.000Z',
          },
        },
      },
      ESMReview: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Review ID',
            example: '60d21b4667d0d8992e610c85',
          },
          product: {
            type: 'string',
            description: 'Product ID',
            example: '60d21b4667d0d8992e610c86',
          },
          seller: {
            type: 'string',
            description: 'Seller ID',
            example: '60d21b4667d0d8992e610c87',
          },
          user: {
            type: 'string',
            description: 'User ID',
            example: '60d21b4667d0d8992e610c88',
          },
          rating: {
            type: 'number',
            description: 'Rating from 1-5',
            example: 5,
          },
          title: {
            type: 'string',
            description: 'Review title',
            example: 'Excellent product and service',
          },
          comment: {
            type: 'string',
            description: 'Review comment',
            example: 'The security system is high quality and the installation was done professionally.',
          },
          pros: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Positive points',
            example: ['Easy to use', 'Professional installation', 'Good value'],
          },
          cons: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Negative points',
            example: ['App could be more intuitive'],
          },
          isVerifiedPurchase: {
            type: 'boolean',
            description: 'Whether the reviewer purchased the product',
            example: true,
          },
          isApproved: {
            type: 'boolean',
            description: 'Admin approval status',
            example: true,
          },
          isHidden: {
            type: 'boolean',
            description: 'Whether the review is hidden',
            example: false,
          },
          sellerResponse: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: 'Seller response text',
                example: 'Thank you for your feedback! We appreciate your business.',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Response date',
                example: '2023-07-05T14:30:15.000Z',
              },
            },
          },
          helpfulness: {
            type: 'object',
            properties: {
              helpful: {
                type: 'number',
                description: 'Number of helpful votes',
                example: 7,
              },
              notHelpful: {
                type: 'number',
                description: 'Number of not helpful votes',
                example: 1,
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
            example: '2023-06-30T12:53:40.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
            example: '2023-07-15T09:22:15.000Z',
          },
        },
      },
      CreateBlogPost: {
        type: 'object',
        required: ['title', 'summary', 'content', 'featuredImage', 'category'],
        properties: {
          title: {
            type: 'string',
            description: 'Blog post title',
            example: 'The Ultimate Guide to Trekking in Meghalaya'
          },
          slug: {
            type: 'string',
            description: 'Blog post slug (generated automatically if not provided)',
            example: 'the-ultimate-guide-to-trekking-in-meghalaya'
          },
          summary: {
            type: 'string',
            description: 'Blog post summary',
            example: 'Discover the hidden gems of Meghalaya with our comprehensive trekking guide'
          },
          content: {
            type: 'string',
            description: 'Blog post content (HTML/Markdown)',
            example: '<p>Meghalaya, known as the "abode of clouds", offers some of the most breathtaking trekking routes in Northeast India...</p>'
          },
          featuredImage: {
            type: 'object',
            required: ['url'],
            properties: {
              url: {
                type: 'string',
                description: 'Featured image URL',
                example: '/uploads/blog/meghalaya-trek-cover.jpg'
              },
              alt: {
                type: 'string',
                description: 'Image alt text',
                example: 'Trekking trail in Meghalaya'
              }
            }
          },
          images: {
            type: 'array',
            description: 'Additional blog post images',
            items: {
              type: 'object',
              required: ['url'],
              properties: {
                url: {
                  type: 'string',
                  description: 'Image URL',
                  example: '/uploads/blog/living-root-bridge.jpg'
                },
                alt: {
                  type: 'string',
                  description: 'Image alt text',
                  example: 'Living root bridge in Nongriat'
                },
                caption: {
                  type: 'string',
                  description: 'Image caption',
                  example: 'The famous double-decker living root bridge in Nongriat'
                }
              }
            }
          },
          category: {
            type: 'string',
            description: 'Blog post category',
            enum: ['travel', 'guides', 'culture', 'food', 'adventure', 'wildlife', 'esm', 'news', 'other'],
            example: 'adventure'
          },
          tags: {
            type: 'array',
            description: 'Blog post tags',
            items: {
              type: 'string'
            },
            example: ['trekking', 'meghalaya', 'northeast', 'hiking', 'nature']
          },
          status: {
            type: 'string',
            description: 'Blog post status',
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            example: 'draft'
          },
          isHighlighted: {
            type: 'boolean',
            description: 'Whether the post should be highlighted',
            default: false,
            example: false
          },
          seo: {
            type: 'object',
            description: 'SEO metadata',
            properties: {
              metaTitle: {
                type: 'string',
                description: 'Meta title (defaults to post title if not provided)',
                example: 'The Ultimate Guide to Trekking in Meghalaya - BeatlenutTrails'
              },
              metaDescription: {
                type: 'string',
                description: 'Meta description',
                example: 'Plan your perfect trekking adventure in Meghalaya with our comprehensive guide to trails, seasons, and essential tips.'
              },
              keywords: {
                type: 'array',
                description: 'SEO keywords',
                items: {
                  type: 'string'
                },
                example: ['meghalaya trekking', 'northeast india', 'living root bridges', 'hiking routes', 'adventure travel']
              }
            }
          }
        }
      },
      UpdateBlogPost: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Blog post title',
            example: 'Updated: The Ultimate Guide to Trekking in Meghalaya'
          },
          slug: {
            type: 'string',
            description: 'Blog post slug',
            example: 'updated-guide-trekking-meghalaya'
          },
          summary: {
            type: 'string',
            description: 'Blog post summary',
            example: 'Updated guide with new trekking routes in Meghalaya'
          },
          content: {
            type: 'string',
            description: 'Blog post content (HTML/Markdown)',
            example: '<p>Updated content with new information...</p>'
          },
          featuredImage: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'Featured image URL',
                example: '/uploads/blog/new-meghalaya-trek-cover.jpg'
              },
              alt: {
                type: 'string',
                description: 'Image alt text',
                example: 'New trekking trail in Meghalaya'
              }
            }
          },
          images: {
            type: 'array',
            description: 'Additional blog post images',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Image URL'
                },
                alt: {
                  type: 'string',
                  description: 'Image alt text'
                },
                caption: {
                  type: 'string',
                  description: 'Image caption'
                }
              }
            }
          },
          category: {
            type: 'string',
            description: 'Blog post category',
            enum: ['travel', 'guides', 'culture', 'food', 'adventure', 'wildlife', 'esm', 'news', 'other']
          },
          tags: {
            type: 'array',
            description: 'Blog post tags',
            items: {
              type: 'string'
            }
          },
          isHighlighted: {
            type: 'boolean',
            description: 'Whether the post should be highlighted'
          },
          seo: {
            type: 'object',
            description: 'SEO metadata',
            properties: {
              metaTitle: {
                type: 'string',
                description: 'Meta title'
              },
              metaDescription: {
                type: 'string',
                description: 'Meta description'
              },
              keywords: {
                type: 'array',
                description: 'SEO keywords',
                items: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      BlogPost: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Blog post ID',
            example: '60d21b4667d0d8992e610c85'
          },
          title: {
            type: 'string',
            description: 'Blog post title',
            example: 'The Ultimate Guide to Trekking in Meghalaya'
          },
          slug: {
            type: 'string',
            description: 'Blog post slug',
            example: 'the-ultimate-guide-to-trekking-in-meghalaya'
          },
          summary: {
            type: 'string',
            description: 'Blog post summary',
            example: 'Discover the hidden gems of Meghalaya with our comprehensive trekking guide'
          },
          content: {
            type: 'string',
            description: 'Blog post content (HTML/Markdown)',
            example: '<p>Meghalaya, known as the "abode of clouds", offers some of the most breathtaking trekking routes in Northeast India...</p>'
          },
          featuredImage: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'Featured image URL',
                example: '/uploads/blog/meghalaya-trek-cover.jpg'
              },
              alt: {
                type: 'string',
                description: 'Image alt text',
                example: 'Trekking trail in Meghalaya'
              }
            }
          },
          category: {
            type: 'string',
            description: 'Blog post category',
            example: 'adventure'
          },
          tags: {
            type: 'array',
            description: 'Blog post tags',
            items: {
              type: 'string'
            },
            example: ['trekking', 'meghalaya', 'northeast', 'hiking', 'nature']
          },
          author: {
            type: 'object',
            description: 'Blog post author',
            properties: {
              id: {
                type: 'string',
                description: 'Author ID',
                example: '60d21b4667d0d8992e610c84'
              },
              name: {
                type: 'string',
                description: 'Author name',
                example: 'John Doe'
              },
              email: {
                type: 'string',
                description: 'Author email',
                example: 'john@example.com'
              }
            }
          },
          status: {
            type: 'string',
            description: 'Blog post status',
            enum: ['draft', 'published', 'archived'],
            example: 'published'
          },
          isHighlighted: {
            type: 'boolean',
            description: 'Whether the post is highlighted',
            example: true
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Publication date',
            example: '2023-07-01T10:30:00.000Z'
          },
          views: {
            type: 'number',
            description: 'View count',
            example: 1250
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
            example: '2023-06-30T12:53:40.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
            example: '2023-07-15T09:22:15.000Z'
          }
        }
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

// Swagger setup function
const setupSwagger = (app) => {
  // Configure Swagger UI options
  const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Beatlenuts-GR API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  };

  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  // Serve swagger spec as JSON
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /api-docs');
};

module.exports = setupSwagger;