/**
 * Retry Utility
 * Allows retrying operations with configurable delays and max attempts
 */
const config = require('../../config/default');

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: from config)
 * @param {number} options.delayMs - Base delay in milliseconds (default: from config)
 * @param {boolean} options.exponential - Whether to use exponential backoff (default: true)
 * @returns {Promise<any>} - The result of the function
 */
async function retryOperation(fn, options = {}) {
  const maxRetries = options.maxRetries || config.requestLimits.maxRetries;
  const baseDelayMs = options.delayMs || config.requestLimits.retryDelayMs;
  const useExponential = options.exponential !== false;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      // Don't retry if it's a client error (4xx)
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      lastError = error;
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`Operation failed after ${attempt + 1} attempts`, error);
        throw error;
      }
      
      // Calculate delay with exponential backoff if enabled
      const delay = useExponential 
        ? baseDelayMs * Math.pow(2, attempt)
        : baseDelayMs;
      
      console.log(`Retrying operation (${attempt + 1}/${maxRetries + 1}) after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Create a retryable version of an async function
 * @param {Function} fn - The function to make retryable
 * @param {Object} options - Retry options (see retryOperation)
 * @returns {Function} - A wrapped function that will retry on failure
 */
function makeRetryable(fn, options = {}) {
  return async (...args) => {
    return retryOperation(() => fn(...args), options);
  };
}

/**
 * Middleware for handling retries in Express routes
 * @param {Object} options - Retry options (see retryOperation)
 * @returns {Function} - Express middleware
 */
function retryMiddleware(options = {}) {
  return (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;
    
    // Replace with our function that retries on 5xx errors
    res.send = function(body) {
      const statusCode = res.statusCode;
      
      // Only retry on server errors (5xx)
      if (statusCode >= 500) {
        req.retryCount = req.retryCount || 0;
        const maxRetries = options.maxRetries || config.requestLimits.maxRetries;
        
        if (req.retryCount < maxRetries) {
          req.retryCount++;
          const delay = options.delayMs || config.requestLimits.retryDelayMs;
          
          console.log(`Route ${req.path} failed with ${statusCode}, retrying (${req.retryCount}/${maxRetries})...`);
          setTimeout(() => next(), delay);
          return this;
        }
      }
      
      // Either not a 5xx or we've used all retries
      return originalSend.call(this, body);
    };
    
    next();
  };
}

module.exports = {
  retryOperation,
  makeRetryable,
  retryMiddleware
};