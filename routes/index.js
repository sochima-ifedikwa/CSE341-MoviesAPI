const express = require('express');
const router = express.Router();

router.use('/actors', require('./actors'));
router.use('/directors', require('./directors'));
router.use('/genres', require('./genres'));
router.use('/movies', require('./movies'));
router.use('/', require('./swagger'));


router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Movies API']
    res.send('Hello World and welcome to tour Movies API!');
    res.send('<h1>Welcome to the MMovies API</h1><p>Use the /actors endpoint to manage actors collection.</p><p>Use the /directors endpoint to manage directors collection.</p><p>Use the /genres endpoint to manage genres collection.</p><p>Use the /movies endpoint to manage movies collection.</p>');
    res.send('<h2>API Documentation</h2><p>Visit <a href="/api-docs">/api-docs</a> for the Swagger UI documentation.</p>');
    res.status(200);

});

module.exports = router;