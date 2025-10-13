// const database = require('../data/database');

// beforeAll(async () => {
//   // Initialize test database connection before running any test
//   await database.initDatabase();
// });

// afterAll(async () => {
//   // Close database after tests
//   await database.closeDb();
//   // Close any open servers if needed
//   if (server && server.close) await server.close();
// });

const database = require('../data/database');
jest.setTimeout(30000); // 30 seconds

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    database.initDatabase((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

afterAll(async () => {
  const db = database.getDatabase();
  await db.close(); // closes MongoClient
});

