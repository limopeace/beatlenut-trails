module.exports = {
  server: {
    port: 4000,
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS) || 30000, // 30 seconds default timeout
  },
  database: {
    url: 'mongodb://localhost:27017/beatlenuts-gr',
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/beatlenuts-gr'
    }
  },
  logging: {
    level: 'info',
  },
  requestLimits: {
    maxRetries: parseInt(process.env.MAX_RETRIES) || 2,
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS) || 1000,
  },
};