const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./database/database')


const app = express();
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
    .use('/', require('./routes/index'));

// Global error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
})

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is connected and listening on port ${port}`);
        });
    }
});
oj 