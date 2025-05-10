const express = require('express');
const router = express.Router();
const exampleRoutes = require('./example');

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Beatlenuts-GR API' });
});

// Mount other routes
router.use('/examples', exampleRoutes);

module.exports = router;