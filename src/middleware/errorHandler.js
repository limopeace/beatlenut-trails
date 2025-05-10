/**
 * Global error handling middleware
 */
const { AppError } = require('../utils/errors');

/**
 * Development error response
 * @param {Error} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Production error response
 * @param {Error} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // In development, send detailed error
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } 
  // In production, send limited error info
  else {
    let error = { ...err };
    error.message = err.message;

    // Convert mongoose errors to operational errors if needed
    // Example: if (error.name === 'CastError') error = new AppError('Invalid ID format', 400);

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;