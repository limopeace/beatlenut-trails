/**
 * Database connection utility
 */
const mongoose = require('mongoose');

// Use the database URL from config or environment variable
const getDbUrl = () => {
  const config = require('../../config/default');
  return process.env.DATABASE_URL || config.database.url;
};

/**
 * Connect to MongoDB
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
const connectDB = async () => {
  try {
    const dbUrl = getDbUrl();
    
    console.log(`Connecting to MongoDB at ${dbUrl}...`);
    
    const conn = await mongoose.connect(dbUrl, {
      // Mongoose 6+ doesn't require these options anymore
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn.connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  disconnectDB
};