const mongoose = require('mongoose');
const User = require('../models/mongoose/userModel');
const ESMSeller = require('../models/mongoose/esmSellerModel');
const ESMProduct = require('../models/mongoose/esmProductModel');
const ESMService = require('../models/mongoose/esmServiceModel');
const config = require('../../config/default');

const DUMMY_SELLERS = [
  {
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    fullName: 'Rajesh Kumar Singh',
    phone: '+91-9876543210',
    location: 'Delhi, India',
    serviceBranch: 'army',
    rank: 'Colonel',
    serviceNumber: 'IC-56789',
    serviceYears: {
      from: 1995,
      to: 2020
    },
    businessName: 'Kumar Security Solutions',
    sellerType: {
      products: true,
      services: true
    },
    category: 'security-services',
    description: 'Providing professional security services with 25 years of military experience.',
    verificationDocument: '/uploads/verification/rajesh-verification.pdf',
    isVerified: true,
    status: 'active'
  },
  {
    email: 'priya.sharma@example.com',
    password: 'password123',
    fullName: 'Priya Sharma',
    phone: '+91-9876543211',
    location: 'Mumbai, India',
    serviceBranch: 'navy',
    rank: 'Lieutenant Commander',
    serviceNumber: 'IN-23456',
    serviceYears: {
      from: 2000,
      to: 2018
    },
    businessName: 'Coastal Adventures',
    sellerType: {
      products: false,
      services: true
    },
    category: 'consulting',
    description: 'Expert travel planning with naval logistics experience.',
    verificationDocument: '/uploads/verification/priya-verification.pdf',
    isVerified: false,
    status: 'pending'
  },
  {
    email: 'vikram.singh@example.com',
    password: 'password123',
    fullName: 'Vikram Singh Rathore',
    phone: '+91-9876543212',
    location: 'Jaipur, India',
    serviceBranch: 'airforce',
    rank: 'Squadron Leader',
    serviceNumber: 'AF-78901',
    serviceYears: {
      from: 1998,
      to: 2022
    },
    businessName: 'Tactical Gear India',
    sellerType: {
      products: true,
      services: false
    },
    category: 'technical-services',
    description: 'High-quality tactical and outdoor equipment.',
    verificationDocument: '/uploads/verification/vikram-verification.pdf',
    isVerified: true,
    status: 'active'
  }
];

const DUMMY_PRODUCTS = [
  {
    name: 'Professional Security Camera System',
    description: 'High-definition 8-camera security system with night vision and remote monitoring capabilities. Perfect for residential and commercial use.',
    shortDescription: 'HD 8-camera security system with night vision and remote monitoring.',
    category: 'security-services',
    type: 'product',
    price: {
      amount: 25000,
      currency: 'INR',
      unit: 'system',
      isNegotiable: true
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13',
        alt: 'Security camera system',
        isMain: true
      },
      {
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d14',
        alt: 'Camera installation',
        isMain: false
      }
    ],
    stock: {
      quantity: 10,
      isAvailable: true
    },
    location: 'Delhi, India',
    isActive: true,
    isFeatured: true,
    specifications: {
      'Resolution': '1080p HD',
      'Cameras': '8 units',
      'Storage': '2TB DVR',
      'Night Vision': 'Yes',
      'Remote Access': 'Mobile app included'
    },
    tags: ['security', 'surveillance', 'cameras', 'home security']
  },
  {
    name: 'Tactical Backpack - Military Grade',
    description: 'Durable 65L tactical backpack designed for outdoor adventures and professional use. Water-resistant with multiple compartments.',
    shortDescription: 'Durable 65L tactical backpack with water resistance.',
    category: 'technical-services',
    type: 'product',
    price: {
      amount: 4500,
      currency: 'INR',
      unit: 'piece',
      isNegotiable: false
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        alt: 'Tactical backpack',
        isMain: true
      },
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a63',
        alt: 'Backpack features',
        isMain: false
      }
    ],
    stock: {
      quantity: 25,
      isAvailable: true
    },
    location: 'Jaipur, India',
    isActive: true,
    isFeatured: false,
    specifications: {
      'Capacity': '65 Liters',
      'Material': 'Cordura Nylon',
      'Water Resistance': 'IPX4',
      'Weight': '2.3 kg',
      'Compartments': '7 main + 12 pockets'
    },
    tags: ['tactical', 'backpack', 'outdoor', 'military', 'hiking']
  },
  {
    name: 'Emergency First Aid Kit - Professional',
    description: 'Comprehensive first aid kit with medical supplies suitable for emergency response and outdoor activities.',
    shortDescription: 'Professional first aid kit with 150+ medical items.',
    category: 'other',
    type: 'product',
    price: {
      amount: 2800,
      currency: 'INR',
      unit: 'kit',
      isNegotiable: true
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584362917165-526f54999433',
        alt: 'First aid kit',
        isMain: true
      },
      {
        url: 'https://images.unsplash.com/photo-1584362917165-526f54999434',
        alt: 'Medical supplies',
        isMain: false
      }
    ],
    stock: {
      quantity: 15,
      isAvailable: true
    },
    location: 'Mumbai, India',
    isActive: true,
    isFeatured: false,
    specifications: {
      'Contents': '150+ medical items',
      'Case': 'Waterproof hard case',
      'Weight': '3.2 kg',
      'Expiry': 'All items 2+ years validity',
      'Certification': 'BIS approved'
    },
    tags: ['first aid', 'medical', 'emergency', 'safety', 'healthcare']
  }
];

const DUMMY_SERVICES = [
  {
    name: 'Personal Security Consultation',
    description: 'Professional security assessment and consultation services for individuals and businesses. Includes risk analysis and security planning.',
    price: 5000,
    duration: '4-6 hours per consultation',
    category: 'other',
    images: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a44'
    ],
    location: 'Delhi, India',
    availability: true,
    features: [
      'Detailed security assessment',
      '2 consultation calls included',
      'Risk analysis report',
      'Security planning guidance',
      '25+ years military experience'
    ],
    tags: ['security', 'consultation', 'risk assessment', 'personal protection']
  },
  {
    name: 'Adventure Travel Planning',
    description: 'Expert travel planning for adventure enthusiasts. Specialized in mountain trekking, water sports, and off-beat destinations.',
    price: 8000,
    duration: 'Complete trip planning',
    category: 'adventure',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306',
      'https://images.unsplash.com/photo-1551632811-561732d1e307'
    ],
    location: 'Mumbai, India',
    availability: true,
    features: [
      'Complete itinerary planning',
      'Accommodation & transport booking',
      '24/7 support during trip',
      'Coastal and mountain specialization',
      '18 years naval service experience'
    ],
    tags: ['travel', 'adventure', 'trekking', 'planning', 'tourism']
  },
  {
    name: 'Equipment Maintenance Training',
    description: 'Professional training for maintenance of tactical and outdoor equipment. Hands-on workshop with certification.',
    price: 3500,
    duration: 'Full day workshop (8 hours)',
    category: 'other',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee159'
    ],
    location: 'Jaipur, India',
    availability: true,
    features: [
      'Full day training (8 hours)',
      'Max 12 participants per group',
      'Training completion certificate',
      'All tools and materials provided',
      '24 years Air Force technical experience'
    ],
    tags: ['training', 'maintenance', 'equipment', 'workshop', 'certification']
  }
];

const DUMMY_ADMIN_USERS = [
  {
    email: 'admin@beatlenut.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    phoneNumber: '+91-9999999999',
    businessName: 'Beatlenuts Administration',
    businessDescription: 'System administration and management',
    approved: true,
    active: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await mongoose.connect(config.database.mongodb.uri);
    console.log('📦 Connected to database');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await ESMSeller.deleteMany({});
    await ESMProduct.deleteMany({});
    await ESMService.deleteMany({});

    // Create admin users
    console.log('👤 Creating admin users...');
    const adminUsers = await User.insertMany(DUMMY_ADMIN_USERS);
    console.log(`✅ Created ${adminUsers.length} admin users`);

    // Create sellers
    console.log('🏪 Creating sellers...');
    const sellers = await ESMSeller.insertMany(DUMMY_SELLERS);
    console.log(`✅ Created ${sellers.length} sellers`);

    // Create products with seller references
    console.log('📦 Creating products...');
    const productsWithSellers = DUMMY_PRODUCTS.map((product, index) => ({
      ...product,
      seller: sellers[index % sellers.length]._id
    }));
    const products = await ESMProduct.insertMany(productsWithSellers);
    console.log(`✅ Created ${products.length} products`);

    // Create services with seller references
    console.log('🛠️ Creating services...');
    const servicesWithSellers = DUMMY_SERVICES.map((service, index) => ({
      ...service,
      provider: sellers[index % sellers.length]._id
    }));
    const services = await ESMService.insertMany(servicesWithSellers);
    console.log(`✅ Created ${services.length} services`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Admin Users: ${adminUsers.length}`);
    console.log(`   Sellers: ${sellers.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Services: ${services.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   Admin: admin@beatlenut.com / admin123');
    console.log('   Seller 1: rajesh.kumar@example.com / password123');
    console.log('   Seller 2: priya.sharma@example.com / password123');
    console.log('   Seller 3: vikram.singh@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, DUMMY_SELLERS, DUMMY_PRODUCTS, DUMMY_SERVICES };