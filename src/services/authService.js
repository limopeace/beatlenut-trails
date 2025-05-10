/**
 * Authentication service
 */
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user and token
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new BadRequestError('User with this email already exists');
      }
      
      // Create and validate new user
      const user = new User(userData);
      user.validate();
      
      // Hash password
      await user.hashPassword();
      
      // In a real implementation, save user to database here
      // For now, we'll just pretend it worked and return the user
      
      // Generate token
      const token = this.generateToken(user);
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} User and token
   */
  async login(email, password) {
    try {
      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }
      
      // Generate token
      const token = this.generateToken(user);
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token for user
   * @param {User} user - User object
   * @returns {String} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}

module.exports = AuthService;