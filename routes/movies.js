// Import required modules
const express = require('express');
const router = express.Router();

// Import controller and middleware
const moviesController = require('../controllers/movies'); // Handles movie-related database logic
const { movieRules, validate } = require('../middleware/validate'); // Validation rules for movie input
const { isAuthenticated } = require('../middleware/authenticate'); // Authentication middleware

/**
 * ===================================
 * MOVIE ROUTES
 * ===================================
 * These routes handle requests related to movie data.
 * The base path for these routes is /movies (defined in index.js).
 */

// ----------------------------------
// GET ROUTES
// ----------------------------------

// Fetch all movies
// Example: GET /movies
router.get('/', moviesController.getAll);

// Fetch movies by specific fields
// Example: GET /movies/findByTitle/Inception
router.get('/findByTitle/:title', moviesController.getByField);

// Example: GET /movies/findByActor/Leonardo%20DiCaprio
router.get('/findByActor/:actors', moviesController.getByField);

// Example: GET /movies/findByGenre/Action
router.get('/findByGenre/:genres', moviesController.getByField);

// Example: GET /movies/findByDirector/Christopher%20Nolan
router.get('/findByDirector/:director', moviesController.getByField);

// Fetch a single movie by its unique ID
// ⚠️ Must remain last to prevent conflicts with other parameterized routes above
// Example: GET /movies/6715bc0f9e3a5c2b745f93b1
router.get('/:id', moviesController.getById);

/**
 * ===================================
 * CRUD OPERATIONS (Protected Routes)
 * ===================================
 * Only authenticated users can perform Create, Update, and Delete operations.
 * These routes use validation rules to ensure correct input format.
 */

// Create a new movie
// Example: POST /movies
// Requires authentication and valid input
router.post('/', isAuthenticated, movieRules(), validate, moviesController.createMovie);

// Update an existing movie by ID
// Example: PUT /movies/6715bc0f9e3a5c2b745f93b1
// Requires authentication and valid input
router.put('/:id', isAuthenticated, movieRules(), validate, moviesController.updateMovie);

// Delete a movie by ID
// Example: DELETE /movies/6715bc0f9e3a5c2b745f93b1
// Requires authentication
router.delete('/:id', isAuthenticated, moviesController.removeMovie);

/**
 * ===================================
 * EXPORT ROUTER
 * ===================================
 * Exports this router so it can be mounted in index.js under /movies
 */
module.exports = router;
