// Import the Express module
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the controller that contains logic for director-related operations
const directorsController = require('../controllers/directors');

// Import validation rules and middleware for validating director input data
const { directorRules, validate } = require('../middleware/validate');

// Import authentication middleware to restrict certain routes
const { isAuthenticated } = require('../middleware/authenticate');

// If in test mode, load mock controller; else, load real one
const isTest = process.env.NODE_ENV === 'test';
const controller = isTest
  ? require('../mocks/directors.mock')
  : require('../controllers/directorsController');

/**
 * ==============================
 * Director Routes
 * ==============================
 * These routes handle CRUD operations for the 'directors' collection.
 * Some routes are public (GET), while others are protected (POST, PUT, DELETE),
 * requiring user authentication before performing write operations.
 */

// Retrieve all directors (Public route)
router.get('/', directorsController.getAll);

// Retrieve a single director by ID (Public route)
router.get('/:id', directorsController.getById);

/**
 * ==============================
 * CRUD Operations (Protected)
 * ==============================
 * Only authenticated users can create, update, or delete director records.
 * Validation is applied to ensure proper data format before database operations.
 */

// Create a new director (Protected route)
// - Requires authentication
// - Validates director input data before creation
router.post('/', isAuthenticated, directorRules(), validate, directorsController.createDirector);

// Update an existing director by ID (Protected route)
// - Requires authentication
// - Validates director input data before updating
router.put('/:id', isAuthenticated, directorRules(), validate, directorsController.updateDirector);

// Delete a director by ID (Protected route)
// - Requires authentication
router.delete('/:id', isAuthenticated, directorsController.removeDirector);

// Export the router so it can be used in the main server file
module.exports = router;
