/**
 * File upload service
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { BadRequestError } = require('../utils/errors');

/**
 * Allowed file types and their corresponding MIME types
 */
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp'
};

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

/**
 * Upload directory path
 */
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

class FileUploadService {
  /**
   * Upload file
   * @param {Object} file - File object (Express file upload)
   * @param {String} subdirectory - Subdirectory to store the file (e.g., 'blog', 'profiles')
   * @returns {Promise<Object>} Uploaded file information
   */
  async uploadFile(file, subdirectory = '') {
    try {
      // Validate file
      this.validateFile(file);
      
      // Create directory if it doesn't exist
      const targetDir = path.join(UPLOAD_DIR, subdirectory);
      await this.ensureDirectoryExists(targetDir);
      
      // Generate unique filename
      const fileExtension = ALLOWED_FILE_TYPES[file.mimetype];
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(targetDir, fileName);
      
      // Write file to disk
      await this.writeFile(file.buffer, filePath);
      
      // Return file information
      const fileUrl = `/${filePath}`;
      return {
        url: fileUrl,
        name: fileName,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  /**
   * Validate file
   * @param {Object} file - File object
   * @throws {BadRequestError} If file is invalid
   */
  validateFile(file) {
    // Check if file exists
    if (!file) {
      throw new BadRequestError('No file provided');
    }
    
    // Check file type
    if (!ALLOWED_FILE_TYPES[file.mimetype]) {
      throw new BadRequestError(`Invalid file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`);
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestError(`File size exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
    }
  }

  /**
   * Ensure directory exists
   * @param {String} dirPath - Directory path
   * @returns {Promise<void>}
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  }

  /**
   * Write file to disk
   * @param {Buffer} buffer - File buffer
   * @param {String} filePath - File path
   * @returns {Promise<void>}
   */
  async writeFile(buffer, filePath) {
    try {
      await fs.promises.writeFile(filePath, buffer);
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error(`Failed to write file: ${filePath}`);
    }
  }

  /**
   * Delete file
   * @param {String} fileUrl - File URL
   * @returns {Promise<boolean>} True if file was deleted
   */
  async deleteFile(fileUrl) {
    try {
      // Extract file path from URL
      const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
      
      // Check if file exists
      await fs.promises.access(filePath);
      
      // Delete file
      await fs.promises.unlink(filePath);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      // Return true even if file doesn't exist (idempotent operation)
      return error.code === 'ENOENT';
    }
  }
}

module.exports = FileUploadService;