const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let database;

const initDatabase = async () => {
  if (database) return database;
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    database = client.db();
    console.log('Connected to MongoDB');
    return database;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

const getDatabase = async () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = { initDatabase, getDatabase };