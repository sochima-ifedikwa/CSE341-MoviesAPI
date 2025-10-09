// Import required modules
const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * ===================================
 * ROUTE MOUNTING
 * ===================================
 * These routes define how different parts of the API are structured.
 * Each route group is delegated to its respective router file for modularity.
 * 
 * Example:
 *   - /actors → handled by routes/actors.js
 *   - /directors → handled by routes/directors.js
 *   - /genres → handled by routes/genres.js
 *   - /movies → handled by routes/movies.js
 *   - / → includes Swagger documentation and default home route
 */

router.use('/actors', require('./actors'));
router.use('/directors', require('./directors'));
router.use('/genres', require('./genres'));
router.use('/movies', require('./movies'));
router.use('/', require('./swagger')); // Swagger documentation route

/**
 * ===================================
 * ROOT ROUTE (Home Page)
 * ===================================
 * This route serves as the entry point of the API.
 * It provides users with a brief guide on available endpoints.
 */
router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Movies API']
    res
      .status(200)
      .send(
        `<h1>Welcome to the Movies API</h1>
        <p>Use the <strong>/actors</strong> endpoint to manage the actors collection.</p>
        <p>Use the <strong>/directors</strong> endpoint to manage the directors collection.</p>
        <p>Use the <strong>/genres</strong> endpoint to manage the genres collection.</p>
        <p>Use the <strong>/movies</strong> endpoint to manage the movies collection.</p>`
      );
});

/**
 * ===================================
 * AUTHENTICATION ROUTES
 * ===================================
 * These routes handle user authentication via GitHub OAuth using Passport.js.
 */

// Initiates GitHub login process
// Redirects user to GitHub for authentication
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Logs the user out of the session
// After successful logout, redirects to the home page
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/**
 * Export the main router so it can be used in app.js (the main server file)
 */
module.exports = router;
