/**
 * Custom error classes for the application
 */

/**
 * Base application error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * NotFound error - Used when a resource is not found
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * BadRequest error - Used for validation errors
 */
class BadRequestError extends AppError {
  constructor(message = 'Invalid request parameters') {
    super(message, 400);
  }
}

/**
 * Unauthorized error - Used for authentication errors
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Forbidden error - Used for authorization errors
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

/**
 * Conflict error - Used for duplicate resource errors
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
};