/**
 * User model
 */
const bcrypt = require('bcrypt');

/**
 * User class for authentication
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.password = data.password || '';
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * Validate user data
   * @returns {Boolean} True if valid, throws error if invalid
   */
  validate() {
    const { BadRequestError } = require('../utils/errors');
    
    if (!this.email) {
      throw new BadRequestError('Email is required');
    }
    
    if (!this.password) {
      throw new BadRequestError('Password is required');
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new BadRequestError('Invalid email format');
    }
    
    // Password strength validation
    if (this.password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }
    
    return true;
  }

  /**
   * Hash user password
   * @returns {Promise<void>}
   */
  async hashPassword() {
    if (!this.password) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  /**
   * Compare password with stored hash
   * @param {String} candidatePassword - Plain text password to check
   * @returns {Promise<Boolean>} True if password matches
   */
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Return user data without sensitive information
   * @returns {Object} Safe user object
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt
    };
  }

  /**
   * Find user by email (mock implementation)
   * @param {String} email - User email
   * @returns {Promise<User|null>} User object or null if not found
   */
  static async findByEmail(email) {
    // In a real implementation, this would query a database
    // Mock user for demonstration
    if (email === 'admin@example.com') {
      return new User({
        id: '1',
        email: 'admin@example.com',
        // This is a hashed version of 'password123'
        password: '$2b$10$rQHp5CSVp1dFc0/Kh6/XFuGA5JX/E3qeVU3s1bGTqeijMX/DYU3UC',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date()
      });
    }
    
    return null;
  }
}

module.exports = User;