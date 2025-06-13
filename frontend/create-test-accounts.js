#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the ESM seller schema (standalone)
const esmSellerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  serviceBranch: {
    type: String,
    required: true,
    enum: ['army', 'navy', 'airforce', 'coast-guard', 'other']
  },
  rank: {
    type: String,
    required: true,
    trim: true
  },
  serviceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  serviceYears: {
    from: {
      type: Number,
      required: true
    },
    to: {
      type: Number,
      required: true
    }
  },
  businessName: {
    type: String,
    trim: true
  },
  sellerType: {
    products: {
      type: Boolean,
      default: false
    },
    services: {
      type: Boolean,
      default: false
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'handicrafts', 
      'food-products', 
      'security-services', 
      'consulting', 
      'training', 
      'agriculture', 
      'technical-services', 
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ESMSeller = mongoose.model('ESMSeller', esmSellerSchema);

async function createTestAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/beatlenuts-gr');
    console.log('Connected to MongoDB');

    // Clear existing test accounts
    await ESMSeller.deleteMany({ email: { $regex: '@test\\.com$' } });
    console.log('Cleared existing test accounts');

    // Create ESM seller accounts
    const testSellers = [
      {
        fullName: 'John Veteran',
        email: 'john.veteran@test.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91-9876543210',
        location: 'Guwahati, Assam',
        serviceBranch: 'army',
        rank: 'Major',
        serviceNumber: 'IC-56789',
        serviceYears: {
          from: 1995,
          to: 2020
        },
        businessName: 'Military Surplus Store',
        sellerType: {
          products: true,
          services: false
        },
        category: 'security-services',
        description: 'Veteran-owned tactical gear and equipment supplier',
        isVerified: true,
        verificationDocument: '/uploads/test-verification-doc.pdf',
        status: 'active',
        ratings: {
          average: 4.5,
          count: 12
        }
      },
      {
        fullName: 'Sarah Military',
        email: 'sarah.military@test.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91-9876543211',
        location: 'Shillong, Meghalaya',
        serviceBranch: 'navy',
        rank: 'Lieutenant Commander',
        serviceNumber: 'IN-12345',
        serviceYears: {
          from: 2000,
          to: 2022
        },
        businessName: 'Security Services Inc.',
        sellerType: {
          products: false,
          services: true
        },
        category: 'consulting',
        description: 'Professional security consultation and training services',
        isVerified: true,
        verificationDocument: '/uploads/test-verification-doc2.pdf',
        status: 'active',
        ratings: {
          average: 4.8,
          count: 8
        }
      },
      {
        fullName: 'Mike Tactical',
        email: 'mike.tactical@test.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91-9876543212',
        location: 'Imphal, Manipur',
        serviceBranch: 'airforce',
        rank: 'Squadron Leader',
        serviceNumber: 'AF-98765',
        serviceYears: {
          from: 1998,
          to: 2018
        },
        businessName: 'Tactical Training Academy',
        sellerType: {
          products: true,
          services: true
        },
        category: 'training',
        description: 'Comprehensive defense and tactical training programs',
        isVerified: true,
        verificationDocument: '/uploads/test-verification-doc3.pdf',
        status: 'active',
        ratings: {
          average: 4.2,
          count: 15
        }
      }
    ];

    const createdSellers = await ESMSeller.insertMany(testSellers);
    console.log('Created ESM sellers:', createdSellers.map(s => s.businessName));

    console.log('\\n=== TEST ESM ACCOUNTS CREATED ===');
    console.log('All accounts are verified and active for testing:');
    console.log('\\n1. john.veteran@test.com / password123');
    console.log('   - Business: Military Surplus Store');
    console.log('   - Type: Products (Security Services)');
    console.log('   - Rating: 4.5/5 (12 reviews)');
    console.log('\\n2. sarah.military@test.com / password123');
    console.log('   - Business: Security Services Inc.');
    console.log('   - Type: Services (Consulting)');
    console.log('   - Rating: 4.8/5 (8 reviews)');
    console.log('\\n3. mike.tactical@test.com / password123');
    console.log('   - Business: Tactical Training Academy');
    console.log('   - Type: Products & Services (Training)');
    console.log('   - Rating: 4.2/5 (15 reviews)');

  } catch (error) {
    console.error('Error creating test accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestAccounts();