/**
 * Mongoose model for examples
 */
const mongoose = require('mongoose');

/**
 * Example schema
 */
const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name must be at most 100 characters long']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be at most 500 characters long']
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Example of a virtual property
exampleSchema.virtual('shortDescription').get(function() {
  if (!this.description) return '';
  return this.description.length > 50 
    ? this.description.substring(0, 50) + '...' 
    : this.description;
});

// Example of a static method
exampleSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};

// Example of an instance method
exampleSchema.methods.isCreatedBy = function(userId) {
  return this.createdBy && this.createdBy.toString() === userId.toString();
};

// Example of middleware (pre-save hook)
exampleSchema.pre('save', function(next) {
  // Example of modifying data before saving
  if (this.name) {
    this.name = this.name.trim();
  }
  next();
});

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;