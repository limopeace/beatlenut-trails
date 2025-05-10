/**
 * Example API integration tests
 */
const request = require('supertest');
const app = require('../../src/index');
const { disconnectDB } = require('../../src/utils/database');

// Mocked token for testing
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MTQ4MzUxLCJleHAiOjE2MTYxNTE5NTF9.4J-aDxKxrhvTXK3G8HDabmCnY9FcMQhdOVLSCoT0xUs';
const mockUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTYxNjE0ODM1MSwiZXhwIjoxNjE2MTUxOTUxfQ.wZ55mI7KpYMgKgH0p4y-JLgQGTvzRhAZhvkLyQgEX_s';

// Clean up after all tests
afterAll(async () => {
  // If you're using a real database, disconnect here
  // await disconnectDB();
});

describe('Example API', () => {
  describe('GET /examples', () => {
    test('should get all examples', async () => {
      const response = await request(app)
        .get('/examples')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('GET /examples/:id', () => {
    test('should get example by ID', async () => {
      const response = await request(app)
        .get('/examples/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('id', '1');
      expect(response.body.data).toHaveProperty('name');
    });
    
    test('should fail with invalid ID format', async () => {
      const response = await request(app)
        .get('/examples/invalid-id')
        .expect('Content-Type', /json/);
      
      // Either 400 (validation error) or 404 (not found) is acceptable
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('POST /examples', () => {
    test('should create example with valid token', async () => {
      const newExample = { name: 'New Test Example', description: 'Test description' };
      
      const response = await request(app)
        .post('/examples')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newExample)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('name', newExample.name);
      expect(response.body.data).toHaveProperty('description', newExample.description);
    });
    
    test('should fail without authentication', async () => {
      const newExample = { name: 'Unauthenticated Example' };
      
      const response = await request(app)
        .post('/examples')
        .send(newExample)
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
    
    test('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/examples')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ description: 'Missing name field' })
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
  
  describe('DELETE /examples/:id', () => {
    test('should allow admin to delete example', async () => {
      const response = await request(app)
        .delete('/examples/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
    });
    
    test('should fail for non-admin user', async () => {
      const response = await request(app)
        .delete('/examples/1')
        .set('Authorization', `Bearer ${mockUserToken}`)
        .expect('Content-Type', /json/)
        .expect(403);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
    
    test('should fail without authentication', async () => {
      const response = await request(app)
        .delete('/examples/1')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
});