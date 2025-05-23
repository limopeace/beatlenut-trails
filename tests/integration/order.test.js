const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Order = require('../../src/models/mongoose/orderModel');
const ESMProduct = require('../../src/models/mongoose/esmProductModel');
const ESMSeller = require('../../src/models/mongoose/esmSellerModel');
const User = require('../../src/models/mongoose/userModel');

describe('Order API Integration Tests', () => {
  let buyerToken, sellerToken, adminToken;
  let testBuyer, testSeller, testProduct, testService;
  let server;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = config.get('database.uri');
    await mongoose.connect(mongoUri);
    
    // Start server
    server = app.listen(0);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create test buyer
    testBuyer = await User.create({
      firstName: 'Test',
      lastName: 'Buyer',
      email: 'buyer@test.com',
      password: 'password123',
      role: 'buyer'
    });

    // Create test seller user
    const sellerUser = await User.create({
      firstName: 'Test',
      lastName: 'Seller',
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    // Create test seller
    testSeller = await ESMSeller.create({
      user: sellerUser._id,
      serviceNumber: 'TEST123456',
      rank: 'Captain',
      businessName: 'Test Business',
      businessType: 'retail',
      businessDescription: 'Test business',
      contactEmail: 'business@test.com',
      contactPhone: '9876543210',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India'
      },
      bankDetails: {
        accountName: 'Test Business',
        accountNumber: '1234567890',
        bankName: 'Test Bank',
        ifscCode: 'TEST0123456'
      },
      status: 'active'
    });

    // Create test product
    testProduct = await ESMProduct.create({
      name: 'Test Product',
      seller: testSeller._id,
      category: 'handicrafts',
      type: 'product',
      description: 'Test product',
      price: {
        amount: 500,
        currency: 'INR'
      },
      stock: {
        available: 10
      },
      status: 'active'
    });

    // Create test service
    testService = await ESMProduct.create({
      name: 'Test Service',
      seller: testSeller._id,
      category: 'consulting-services',
      type: 'service',
      description: 'Test service',
      price: {
        amount: 1000,
        currency: 'INR'
      },
      availability: {
        inPerson: true,
        remote: true
      },
      status: 'active'
    });

    // Generate tokens
    buyerToken = jwt.sign(
      { id: testBuyer._id, role: 'buyer' },
      config.get('auth.jwtSecret')
    );

    sellerToken = jwt.sign(
      { id: sellerUser._id, role: 'seller' },
      config.get('auth.jwtSecret')
    );

    adminToken = jwt.sign(
      { id: adminUser._id, role: 'admin' },
      config.get('auth.jwtSecret')
    );
  });

  afterEach(async () => {
    await Order.deleteMany({});
    await ESMProduct.deleteMany({});
    await ESMSeller.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/esm/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        seller: testSeller._id.toString(),
        items: [
          {
            product: testProduct._id.toString(),
            quantity: 2
          }
        ],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          phone: '9876543210'
        },
        shippingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          phone: '9876543210'
        },
        paymentMethod: 'upi'
      };

      const response = await request(server)
        .post('/api/esm/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orderNumber');
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.subtotal).toBe(1000); // 2 * 500
    });

    it('should fail with invalid seller', async () => {
      const orderData = {
        seller: '123456789012345678901234', // Invalid ObjectId
        items: [
          {
            product: testProduct._id.toString(),
            quantity: 1
          }
        ],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          phone: '9876543210'
        },
        paymentMethod: 'upi'
      };

      const response = await request(server)
        .post('/api/esm/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/esm/orders/me', () => {
    it('should get current user orders', async () => {
      // Create test order
      await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'pending'
        }
      });

      const response = await request(server)
        .get('/api/esm/orders/me')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/esm/orders/:id', () => {
    it('should get order by ID', async () => {
      const order = await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'pending'
        }
      });

      const response = await request(server)
        .get(`/api/esm/orders/${order._id}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orderNumber).toBe(order.orderNumber);
    });

    it('should fail for unauthorized user', async () => {
      const order = await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'pending'
        }
      });

      // Create another user
      const anotherUser = await User.create({
        firstName: 'Another',
        lastName: 'User',
        email: 'another@test.com',
        password: 'password123',
        role: 'buyer'
      });

      const anotherToken = jwt.sign(
        { id: anotherUser._id, role: 'buyer' },
        config.get('auth.jwtSecret')
      );

      const response = await request(server)
        .get(`/api/esm/orders/${order._id}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/esm/orders/:id/status', () => {
    it('should update order status as seller', async () => {
      const order = await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'completed'
        },
        status: 'processing'
      });

      const response = await request(server)
        .patch(`/api/esm/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          status: 'confirmed',
          note: 'Order is being prepared'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('confirmed');
    });

    it('should allow buyer to cancel pending order', async () => {
      const order = await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'pending'
        },
        status: 'pending'
      });

      const response = await request(server)
        .patch(`/api/esm/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          status: 'cancelled',
          note: 'Changed my mind'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('cancelled');
    });
  });

  describe('POST /api/esm/orders/:id/cancel', () => {
    it('should cancel order', async () => {
      const order = await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'pending'
        },
        status: 'pending'
      });

      const response = await request(server)
        .post(`/api/esm/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          reason: 'Found a better price elsewhere'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('cancelled');
      expect(response.body.data.cancellationReason).toBe('Found a better price elsewhere');
    });
  });

  describe('GET /api/esm/orders/search', () => {
    it('should search orders', async () => {
      // Create multiple orders
      await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 500,
          currency: 'INR',
          status: 'completed'
        },
        status: 'delivered'
      });

      await Order.create({
        buyer: testBuyer._id,
        seller: testSeller._id,
        items: [{
          product: testProduct._id,
          quantity: 2,
          price: testProduct.price.amount
        }],
        billingAddress: {
          fullName: 'Test Buyer',
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456',
          country: 'India',
          phone: '9876543210'
        },
        payment: {
          method: 'upi',
          amount: 1000,
          currency: 'INR',
          status: 'pending'
        },
        status: 'pending'
      });

      const response = await request(server)
        .get('/api/esm/orders/search')
        .set('Authorization', `Bearer ${buyerToken}`)
        .query({
          status: 'pending',
          minAmount: 800
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].total).toBeGreaterThanOrEqual(800);
    });
  });
});