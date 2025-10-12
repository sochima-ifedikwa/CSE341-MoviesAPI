// jest.config.js
// module.exports = {
//   testEnvironment: 'node',          // run tests in Node.js (not browser)
//   verbose: true,                    // show each test result
//   forceExit: true,                  // force Jest to exit when done (useful for DB tests)
//   detectOpenHandles: true,          // helps catch unclosed DB or server connections
//   setupFiles: ['dotenv/config'],    // automatically load .env file before tests
// };
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.js'],
};

