// ===============================================
// IMPORT REQUIRED MODULES
// ===============================================
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./data/database'); // Database connection setup
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy; // OAuth authentication via GitHub
const port = process.env.PORT || 5000; // Define the server port

// Set a default session secret during test mode
if (process.env.NODE_ENV === 'test') {
  process.env.SESSION_SECRET = 'test-secret';
}

// ===============================================
// MIDDLEWARE CONFIGURATION
// ===============================================
app
  // Parse JSON request bodies
  
  .use(bodyParser.json())  

  // Parse URL-encoded form data
  .use(bodyParser.urlencoded({ extended: true }))

  // Configure session management
  .use(
    session({
      secret: process.env.SESSION_SECRET || 'team_seven_rocks', // Secret for encrypting session IDs
      resave: false, // Don’t save session if nothing changed
      saveUninitialized: true // Save session even if empty
    })
  )

  // Initialize Passport for authentication
  .use(passport.initialize())

  // Allow Passport to use session cookies
  .use(passport.session())

  // ===============================================
  // CORS CONFIGURATION
  // ===============================================
  // Allow requests from all origins and common HTTP methods
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
  })

  // Mount main routes from the routes folder
  .use('/', require('./routes/index'))

  // Enable global CORS for all requests
  .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UPDATE'] }))
  .use(cors({ origin: '*' }));

// ===============================================
// PASSPORT GITHUB STRATEGY
// ===============================================
if (process.env.NODE_ENV !== 'test') {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      function (accessToken, refreshToken, profile, done) {
        // Return user profile after successful authentication
        return done(null, profile);
      }
    )
  );
}

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ===============================================
// ROOT & TEST LOGIN ROUTES
// ===============================================
app.get('/', (req, res) => {
  // If running in test mode and a query ?test=true is passed, create fake session
  if (process.env.NODE_ENV === 'test' && req.query.test === 'true') {
    req.session.user = { displayName: 'Test User' }; // fake logged-in user
    return res.status(200).json({ message: 'Test login successful', user: req.session.user });
  }

  // Normal root route — show login status
  res.send(
    req.session.user
      ? `Logged in as ${req.session.user.displayName}`
      : 'Logged out'
  );
});

// GitHub OAuth callback route
app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user; // Save authenticated user in session
    res.redirect('/'); // Redirect to the homepage
  }
);

// ===============================================
// GLOBAL ERROR HANDLING
// ===============================================
// Catch unhandled exceptions and prevent the app from crashing
process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// ===============================================
// DATABASE CONNECTION AND SERVER START
// ===============================================
if (process.env.NODE_ENV !== 'test') {
  // Initialize database and start server
  mongodb.initDatabase((err) => {
    if (err) {
      console.error(err);
    } else {
      app.listen(port, () => {
        console.log(`✅ Connected to Database and listening on port ${port}`);
      });
    }
  });
} else {
  console.log('🧪 Test mode: server not listening');
}

// Export app for testing
module.exports = app;
