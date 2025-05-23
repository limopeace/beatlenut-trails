/**
 * Authentication service
 */
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user and token
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new BadRequestError('User with this email already exists');
      }

      // Create new user in database
      const user = await this.userRepository.create(userData);

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
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
      // Find user with password field
      const user = await this.userRepository.findByEmailWithPassword(email);
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
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
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
        id: user._id || user.id,
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
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if user exists and token is still valid
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User
   */
  async getUserById(userId) {
    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * ESM Portal specific login
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} User and token
   */
  async esmLogin(email, password) {
    try {
      const user = await this.userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is a seller or buyer (ESM roles)
      if (!['seller', 'buyer'].includes(user.role)) {
        throw new UnauthorizedError('Access denied. This portal is for ESM sellers and buyers only.');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          businessName: user.businessName,
          businessDescription: user.businessDescription,
          approved: user.approved,
          createdAt: user.createdAt
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ESM Portal specific registration
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user and token
   */
  async esmRegister(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new BadRequestError('User with this email already exists');
      }

      // Set default role if not provided
      if (!userData.role || !['seller', 'buyer'].includes(userData.role)) {
        userData.role = 'seller';
      }

      // Set default approval status for sellers
      if (userData.role === 'seller') {
        userData.approved = false;
      }

      // Create new user in database
      const user = await this.userRepository.create(userData);

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          businessName: user.businessName,
          businessDescription: user.businessDescription,
          approved: user.approved,
          createdAt: user.createdAt
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current ESM user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User
   */
  async getEsmUser(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Check if user is a seller or buyer (ESM roles)
      if (!['seller', 'buyer'].includes(user.role)) {
        throw new UnauthorizedError('Access denied. This portal is for ESM sellers and buyers only.');
      }

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        businessName: user.businessName,
        businessDescription: user.businessDescription,
        approved: user.approved,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update ESM user profile
   * @param {String} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated user
   */
  async updateEsmProfile(userId, updateData) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Check if user is a seller or buyer (ESM roles)
      if (!['seller', 'buyer'].includes(user.role)) {
        throw new UnauthorizedError('Access denied. This portal is for ESM sellers and buyers only.');
      }

      // Update user profile
      const updatedUser = await this.userRepository.update(userId, updateData);

      return {
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        businessName: updatedUser.businessName,
        businessDescription: updatedUser.businessDescription,
        approved: updatedUser.approved,
        createdAt: updatedUser.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Admin login
   * @param {String} email - Admin email
   * @param {String} password - Admin password
   * @returns {Promise<Object>} Admin user and token
   */
  async adminLogin(email, password) {
    try {
      const user = await this.userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user has admin role
      if (user.role !== 'admin') {
        throw new UnauthorizedError('Access denied. Admin privileges required.');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      });

      return {
        user: this.formatUserResponse(user),
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();