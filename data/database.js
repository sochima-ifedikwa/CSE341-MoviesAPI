// Load environment variables from .env file
const dotenv = require('dotenv').config({ path: './.env' });

// Import MongoClient from MongoDB driver
const { MongoClient } = require('mongodb');

// Declare a variable to hold the database connection instance
let database;

/**
 * Initializes the database connection.
 * 
 * - Checks if the database is already initialized (to avoid reconnecting unnecessarily)
 * - Connects to MongoDB using the URI stored in the .env file (process.env.MONGODB_URI)
 * - Once connected, stores the client object in the `database` variable
 * - Calls the callback function with the database client or an error
 */
const initDatabase = (callback) => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database); // Return existing connection
  }

  // Attempt to connect to MongoDB
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client; // Save the connection instance for reuse
      callback(null, database); // Pass the client to the callback
    })
    .catch((err) => {
      callback(err); // Return connection error if failed
    });
};

/**
 * Returns the existing database connection.
 * 
 * - Throws an error if the database has not yet been initialized
 * - Otherwise, returns the connected client instance
 */
const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

// Export the initialization and getter functions
module.exports = { 
  initDatabase, 
  getDatabase 
};
