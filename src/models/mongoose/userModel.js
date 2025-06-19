/**
 * Mongoose model for users
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User schema
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in query results by default
  },
  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name must be at most 100 characters long']
  },
  
  role: {
    type: String,
    enum: ['user', 'admin', 'seller', 'buyer'],
    default: 'user'
  },
  
  active: {
    type: Boolean,
    default: true
  },
  
  // ESM Portal specific fields
  phoneNumber: {
    type: String,
    trim: true
  },
  
  businessName: {
    type: String,
    trim: true
  },
  
  businessDescription: {
    type: String,
    trim: true
  },
  
  approved: {
    type: Boolean,
    default: false
  },
  
  identityProof: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property example
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // If this is a password change, update passwordChangedAt
    if (this.isModified('password') && !this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to ensure token is created after password change
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-query middleware to exclude inactive users
userSchema.pre(/^find/, function(next) {
  // 'this' refers to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  
  // Password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;