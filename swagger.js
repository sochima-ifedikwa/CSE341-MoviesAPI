const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'API for managing movies'
  },
  host: 'cse341-moviesapi.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json'; // Output file for the generated Swagger documentation should be created in the root directory EMPTY
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);