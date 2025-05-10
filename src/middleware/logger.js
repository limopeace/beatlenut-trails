/**
 * Simple request logger middleware
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Once the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

module.exports = logger;