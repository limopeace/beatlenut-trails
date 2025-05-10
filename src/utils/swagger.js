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
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Serve swagger spec as JSON
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation available at /api-docs');
};

module.exports = setupSwagger;