const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example');

// Get all examples
router.get('/', exampleController.getAll);

// Get example by ID
router.get('/:id', exampleController.getById);

// Create new example
router.post('/', exampleController.create);

module.exports = router;