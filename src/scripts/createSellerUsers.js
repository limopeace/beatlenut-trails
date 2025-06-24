const mongoose = require('mongoose');
const User = require('../models/mongoose/userModel');
const ESMSeller = require('../models/mongoose/esmSellerModel');

async function createSellerUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/beatlenuts-gr');
    console.log('Connected to database');
    
    // Get ESM sellers
    const sellers = await ESMSeller.find({});
    console.log('Found ESM sellers:', sellers.length);
    
    // Create corresponding User records
    for (const seller of sellers) {
      const existingUser = await User.findOne({ email: seller.email });
      if (!existingUser) {
        const userData = {
          email: seller.email,
          password: 'seller123',
          name: seller.fullName,
          phoneNumber: seller.phone,
          role: 'seller',
          businessName: seller.businessName,
          businessDescription: seller.description,
          approved: seller.status === 'active',
          active: true
        };
        
        const user = await User.create(userData);
        console.log('Created user for seller:', seller.email);
      } else {
        console.log('User already exists for:', seller.email);
      }
    }
    
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error:', error);
  }
}

createSellerUsers();