const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Order = require('../src/models/mongoose/orderModel');
const ESMProduct = require('../src/models/mongoose/esmProductModel');
const ESMSeller = require('../src/models/mongoose/esmSellerModel');
const User = require('../src/models/mongoose/userModel');

// Connect to test database
beforeAll(async () => {
  const mongoUri = config.get('database.uri');
  await mongoose.connect(mongoUri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Order Management System Tests', () => {
  let testBuyer, testSeller, testProduct, testService;
  let buyerToken, sellerToken;

  beforeEach(async () => {
    // Create test buyer
    testBuyer = await User.create({
      firstName: 'Test',
      lastName: 'Buyer',
      email: 'testbuyer@example.com',
      password: 'password123',
      role: 'buyer'
    });

    // Create test seller user
    const sellerUser = await User.create({
      firstName: 'Test',
      lastName: 'Seller',
      email: 'testseller@example.com',
      password: 'password123',
      role: 'seller'
    });

    // Create test seller
    testSeller = await ESMSeller.create({
      user: sellerUser._id,
      serviceNumber: 'TEST123456',
      rank: 'Captain',
      businessName: 'Test ESM Business',
      businessType: 'retail',
      businessDescription: 'Test business for order system',
      contactEmail: 'business@example.com',
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
      description: 'Test product for order system',
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
      description: 'Test service for order system',
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
  });

  afterEach(async () => {
    // Clean up test data
    await Order.deleteMany({});
    await ESMProduct.deleteMany({});
    await ESMSeller.deleteMany({});
    await User.deleteMany({});
  });

  test('Create a product order', async () => {
    const orderData = {
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
      shippingAddress: {
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
      }
    };

    const order = await Order.create(orderData);

    expect(order).toBeDefined();
    expect(order.orderNumber).toMatch(/^ESM\d{8}$/);
    expect(order.subtotal).toBe(1000);
    expect(order.status).toBe('pending');
    expect(order.items.length).toBe(1);
    expect(order.items[0].product.toString()).toBe(testProduct._id.toString());
  });

  test('Create a service order', async () => {
    const orderData = {
      buyer: testBuyer._id,
      seller: testSeller._id,
      items: [{
        service: testService._id,
        quantity: 1,
        price: testService.price.amount
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
        method: 'credit_card',
        amount: 1000,
        currency: 'INR',
        status: 'pending'
      },
      isServiceOrder: true,
      serviceSchedule: {
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 25 * 60 * 60 * 1000), // Day after tomorrow
        duration: 60,
        location: 'Test Location'
      }
    };

    const order = await Order.create(orderData);

    expect(order).toBeDefined();
    expect(order.isServiceOrder).toBe(true);
    expect(order.serviceSchedule).toBeDefined();
    expect(order.items[0].service.toString()).toBe(testService._id.toString());
  });

  test('Update order status', async () => {
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
      shippingAddress: {
        fullName: 'Test Buyer',
        line1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '123456',
        country: 'India',
        phone: '9876543210'
      },
      payment: {
        method: 'cod',
        amount: 500,
        currency: 'INR',
        status: 'pending'
      }
    });

    // Update status to processing
    order.status = 'processing';
    await order.save();

    expect(order.status).toBe('processing');
    expect(order.statusHistory.length).toBeGreaterThan(0);
    expect(order.statusHistory[order.statusHistory.length - 1].status).toBe('processing');
  });

  test('Cancel order', async () => {
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
      shippingAddress: {
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

    // Cancel order
    await order.cancel('Customer requested cancellation');

    expect(order.status).toBe('cancelled');
    expect(order.cancellationReason).toBe('Customer requested cancellation');
  });

  test('Add tracking information', async () => {
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
      shippingAddress: {
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
      status: 'confirmed'
    });

    // Add tracking
    await order.addTracking(
      'DHL',
      'DHL123456789',
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    );

    expect(order.trackingInfo.carrier).toBe('DHL');
    expect(order.trackingInfo.trackingNumber).toBe('DHL123456789');
    expect(order.status).toBe('shipped');
  });

  test('Process refund', async () => {
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
      shippingAddress: {
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
      status: 'delivered',
      total: 500
    });

    // Process refund
    await order.refund(500, 'Product defective');

    expect(order.payment.status).toBe('refunded');
    expect(order.payment.refundAmount).toBe(500);
    expect(order.payment.refundReason).toBe('Product defective');
    expect(order.status).toBe('refunded');
  });

  test('Calculate order totals correctly', async () => {
    const orderData = {
      buyer: testBuyer._id,
      seller: testSeller._id,
      items: [
        {
          product: testProduct._id,
          quantity: 2,
          price: 500
        },
        {
          product: testProduct._id,
          quantity: 1,
          price: 500
        }
      ],
      billingAddress: {
        fullName: 'Test Buyer',
        line1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '123456',
        country: 'India',
        phone: '9876543210'
      },
      shippingAddress: {
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
        amount: 1500,
        currency: 'INR',
        status: 'pending'
      },
      shippingFee: 100,
      discount: 50,
      tax: 270, // 18% of 1500
      platformFee: 75 // 5% of 1500
    };

    const order = await Order.create(orderData);

    expect(order.subtotal).toBe(1500); // (2 * 500) + (1 * 500)
    expect(order.total).toBe(1820); // 1500 + 270 + 100 - 50
    expect(order.sellerPayout).toBe(1425); // 1500 - 75
  });
});

// Export for use in other tests
module.exports = {
  createTestOrder: async (buyer, seller, product) => {
    return await Order.create({
      buyer: buyer._id,
      seller: seller._id,
      items: [{
        product: product._id,
        quantity: 1,
        price: product.price.amount
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
        amount: product.price.amount,
        currency: 'INR',
        status: 'pending'
      }
    });
  }
};