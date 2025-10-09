// Import the Express module
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the controller that handles the actor-related logic
const actorsController = require('../controllers/actors');

// Import validation rules and middleware for validating actor data
const { actorRules, validate } = require('../middleware/validate');

// Import authentication middleware to protect certain routes
const { isAuthenticated } = require('../middleware/authenticate');

/**
 * ==============================
 * Actor Routes
 * ==============================
 * These routes handle CRUD operations for the 'actors' collection.
 * Some routes are public (GET), while others are protected (POST, PUT, DELETE)
 * requiring user authentication via `isAuthenticated`.
 */

// Retrieve all actors (Public route)
router.get('/', actorsController.getAll);

// Retrieve a single actor by ID (Public route)
router.get('/:id', actorsController.getById);

/**
 * ==============================
 * CRUD Operations (Protected)
 * ==============================
 * Only authenticated users can create, update, or delete actor records.
 */

// Create a new actor (Protected route)
// - Requires authentication
// - Validates actor data before creating
router.post('/', isAuthenticated, actorRules(), validate, actorsController.createActor);

// Update an existing actor by ID (Protected route)
// - Requires authentication
// - Validates actor data before updating
router.put('/:id', isAuthenticated, actorRules(), validate, actorsController.updateActor);

// Delete an actor by ID (Protected route)
// - Requires authentication
router.delete('/:id', isAuthenticated, actorsController.removeActor);

// Export the router for use in the main server file
module.exports = router;
