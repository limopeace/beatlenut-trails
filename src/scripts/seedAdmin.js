#!/usr/bin/env node

/**
 * Admin User Seeding Script
 * Creates a default admin user for the system
 */

const mongoose = require('mongoose');
const User = require('../models/mongoose/userModel');
const config = require('../../config/default');

const ADMIN_USER = {
  email: 'admin@beatlenut.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
  active: true
};

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = config.database?.url || process.env.MONGODB_URI || 'mongodb://localhost:27017/beatlenuts-gr';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🔐 Role: ${existingAdmin.role}`);
      
      // Update password if needed (for development)
      existingAdmin.password = ADMIN_USER.password;
      await existingAdmin.save();
      console.log('🔄 Admin password updated for development');
      
      return;
    }

    // Create new admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User(ADMIN_USER);
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔐 Role: ${adminUser.role}`);
    console.log(`🆔 ID: ${adminUser._id}`);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate email detected');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  console.log('🌱 Starting admin user seeding...');
  console.log('================================');
  
  seedAdmin()
    .then(() => {
      console.log('🎉 Admin seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAdmin, ADMIN_USER };