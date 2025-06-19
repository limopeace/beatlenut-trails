/**
 * Script to create default admin user
 * Run this script to set up the initial admin user for the system
 */

const mongoose = require('mongoose');
const User = require('../models/mongoose/userModel');
const config = require('../../config/default');

/**
 * Create default admin user if it doesn't exist
 */
async function createDefaultAdmin() {
  try {
    console.log('🔍 Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@beatlenut.com',
      role: 'admin' 
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🔒 Role: ${existingAdmin.role}`);
      return existingAdmin;
    }
    
    console.log('👤 Creating default admin user...');
    
    // Create default admin user
    const adminUser = new User({
      email: 'admin@beatlenut.com',
      password: 'admin123',
      name: 'System Administrator',
      role: 'admin',
      active: true,
      approved: true,
      phoneNumber: '+91-9999999999',
      businessName: 'Beatlenuts-GR Administration'
    });
    
    await adminUser.save();
    
    console.log('✅ Default admin user created successfully!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('📧 Email: admin@beatlenut.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    console.log('');
    
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
}

/**
 * Reset admin password (for emergency access)
 */
async function resetAdminPassword(newPassword = 'admin123') {
  try {
    console.log('🔄 Resetting admin password...');
    
    const admin = await User.findOne({ 
      email: 'admin@beatlenut.com',
      role: 'admin' 
    });
    
    if (!admin) {
      throw new Error('Admin user not found');
    }
    
    admin.password = newPassword;
    await admin.save();
    
    console.log('✅ Admin password reset successfully!');
    console.log(`🔑 New password: ${newPassword}`);
    
    return admin;
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
    throw error;
  }
}

/**
 * Main function - create admin user and handle database connection
 */
async function main() {
  let connection;
  
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    
    const mongoUri = process.env.MONGODB_URI || config.database.mongodb.uri;
    connection = await mongoose.connect(mongoUri);
    
    console.log('✅ Database connected successfully');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'reset-password') {
      const newPassword = args[1] || 'admin123';
      await resetAdminPassword(newPassword);
    } else {
      await createDefaultAdmin();
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    if (connection) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Export functions for use in other modules
module.exports = {
  createDefaultAdmin,
  resetAdminPassword
};

// Run script if called directly
if (require.main === module) {
  main();
}