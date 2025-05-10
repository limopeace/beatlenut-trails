/**
 * Authentication API integration tests
 */
const request = require('supertest');
const app = require('../../src/index');
const { disconnectDB } = require('../../src/utils/database');

// Mocked token for testing
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MTQ4MzUxLCJleHAiOjE2MTYxNTE5NTF9.4J-aDxKxrhvTXK3G8HDabmCnY9FcMQhdOVLSCoT0xUs';

// Mock user data
const mockUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

// Clean up after all tests
afterAll(async () => {
  // If you're using a real database, disconnect here
  // await disconnectDB();
});

describe('Authentication API', () => {
  describe('POST /auth/register', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', mockUser.email);
      expect(response.body.data.user).toHaveProperty('name', mockUser.name);
      expect(response.body.data.user).not.toHaveProperty('password');
    });
    
    test('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid@example.com' }) // Missing password and name
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
    
    test('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        })
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('email');
    });
    
    test('should fail with password too short', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          name: 'Test User'
        })
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('password');
    });
  });
  
  describe('POST /auth/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        })
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'admin@example.com');
    });
    
    test('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
    
    test('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
  
  describe('GET /auth/profile', () => {
    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
    });
    
    test('should fail with missing token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
    
    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
});