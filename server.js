const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const cors = require('cors');
const port = process.env.PORT || 5000;


app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
  })
  .use('/', require('./routes/index'))
  .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UPDATE']}))
  .use(cors({ origin: '*'}));

// Global error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
})


mongodb.initDatabase((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to Database and listening on port ${port}`);
    });
  }
});