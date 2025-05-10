/**
 * Request monitoring middleware
 */

/**
 * Response time middleware
 * Adds X-Response-Time header to responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const responseTime = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
    res.set('X-Response-Time', `${time.toFixed(2)}ms`);
  });
  
  next();
};

/**
 * Request tracking middleware
 * Logs request information and tracks active requests
 */
const requestTracker = () => {
  let activeRequests = 0;
  
  // Log active requests count every minute
  setInterval(() => {
    if (activeRequests > 0) {
      console.log(`Active requests: ${activeRequests}`);
    }
  }, 60000);
  
  return (req, res, next) => {
    // Increment counter
    activeRequests++;
    
    // Add request ID
    req.id = Math.random().toString(36).substring(2, 15);
    
    // Log request
    console.log(`[${req.id}] ${req.method} ${req.originalUrl} - Started`);
    
    // Log and decrement on finish
    res.on('finish', () => {
      activeRequests--;
      console.log(`[${req.id}] ${req.method} ${req.originalUrl} - ${res.statusCode}`);
    });
    
    // Handle errors
    res.on('error', (err) => {
      activeRequests--;
      console.error(`[${req.id}] ${req.method} ${req.originalUrl} - Error: ${err.message}`);
    });
    
    next();
  };
};

/**
 * Health check middleware
 * @param {Object} options - Health check options
 * @returns {Function} Express middleware function
 */
const healthCheck = (options = {}) => {
  const defaultOptions = {
    path: '/health',
    detailed: false,
    ...options
  };
  
  return (req, res, next) => {
    if (req.path === defaultOptions.path) {
      const healthData = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now()
      };
      
      if (defaultOptions.detailed) {
        healthData.memory = process.memoryUsage();
        healthData.cpu = process.cpuUsage();
        healthData.pid = process.pid;
        healthData.node = process.version;
      }
      
      return res.json(healthData);
    }
    
    next();
  };
};

module.exports = {
  responseTime,
  requestTracker,
  healthCheck
};