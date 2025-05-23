/**
 * Script to check if admin user exists in the database
 * or create one if it doesn't exist
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/mongoose/userModel');
require('dotenv').config();

const adminUser = {
  email: 'admin@beatlenut.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

async function checkOrCreateAdminUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatlenut-esm');
    console.log('Connected to MongoDB');
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.email}`);
      console.log(`Admin user role: ${existingAdmin.role}`);
      
      // Update role if necessary
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated user role to admin');
      }
    } else {
      // Create admin user
      console.log('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      const newAdmin = new User({
        email: adminUser.email,
        password: hashedPassword,
        name: adminUser.name,
        role: adminUser.role,
        approved: true,
        active: true
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

checkOrCreateAdminUser();