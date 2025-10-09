// Import required modules
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express'); // Middleware for serving Swagger UI
const swaggerDocument = require('../swagger.json'); // Swagger specification file (API documentation)

/**
 * ===================================
 * SWAGGER DOCUMENTATION ROUTE
 * ===================================
 * This route serves the interactive Swagger UI documentation
 * for your API, allowing developers and testers to easily
 * explore and test available endpoints.
 */

// Serve Swagger UI at /api-docs
// Access the docs in browser via: http://localhost:<PORT>/api-docs
router.use('/api-docs', swaggerUi.serve);

// Set up Swagger UI with your Swagger JSON configuration
router.use('/api-docs', swaggerUi.setup(swaggerDocument));

/**
 * ===================================
 * EXPORT ROUTER
 * ===================================
 * Exports this router so it can be mounted in the main routes index.js file.
 */
module.exports = router;
