const express = require('express');
const router = express.Router();
const exampleRoutes = require('./example');
const authRoutes = require('./auth');

// Home route
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Beatlenuts-GR API',
    version: '1.0.0'
  });
});

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount API routes
router.use('/examples', exampleRoutes);

module.exports = router;