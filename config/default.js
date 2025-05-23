module.exports = {
  server: {
    port: 3000,
    timeout: process.env.REQUEST_TIMEOUT_MS || 30000, // 30 seconds default timeout
  },
  database: {
    url: 'mongodb://localhost:27017/beatlenuts-gr',
  },
  logging: {
    level: 'info',
  },
  requestLimits: {
    maxRetries: process.env.MAX_RETRIES || 2,
    retryDelayMs: process.env.RETRY_DELAY_MS || 1000,
  },
};