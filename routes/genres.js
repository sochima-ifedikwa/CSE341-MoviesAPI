// Import the Express module to create a router
const express = require('express');

// Initialize the Express Router
const router = express.Router();

// Import the controller that handles business logic for the 'genres' collection
const genresController = require('../controllers/genres');

// Import validation rules and middleware for verifying genre input data
const { genreRules, validate } = require('../middleware/validate');

// Import authentication middleware to secure specific routes
const { isAuthenticated } = require('../middleware/authenticate');

// If in test mode, load mock controller; else, load real one
const isTest = process.env.NODE_ENV === 'test';
const controller = isTest
  ? require('../mocks/genres.mock')
  : require('../controllers/genres');

/**
 * ===================================
 * Genre Routes
 * ===================================
 * These routes define endpoints for performing CRUD operations
 * on the 'genres' collection in the database.
 * 
 * - Public routes: GET requests (retrieving data)
 * - Protected routes: POST, PUT, DELETE (modifying data)
 */

/* -------------------------------
   READ OPERATIONS (Public Routes)
--------------------------------*/

// Retrieve all genres
router.get('/', genresController.getAll);

// Retrieve a single genre by its ID
router.get('/:id', genresController.getById);

/* -------------------------------
   WRITE OPERATIONS (Protected Routes)
--------------------------------*/
// Only authenticated users can perform the following operations

// Create a new genre
// - Validates genre data using `genreRules()` before creation
router.post('/', isAuthenticated, genreRules(), validate, genresController.createGenre);

// Update an existing genre by ID
// - Requires authentication
// - Validates genre data before updating
router.put('/:id', isAuthenticated, genreRules(), validate, genresController.updateGenre);

// Delete a genre by ID
// - Requires authentication
router.delete('/:id', isAuthenticated, genresController.removeGenre);

/**
 * Export the router to be used in the main server entry point (e.g., app.js or server.js)
 */
module.exports = router;
