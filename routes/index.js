const express = require('express');
const router = express.Router();

router.use('/actors', require('./actors'));
router.use('/directors', require('./directors'));
router.use('/genres', require('./genres'));
router.use('/movies', require('./movies'));
router.use('/', require('./swagger'));


router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Movies API']
    res.send('Hello World');  
});

module.exports = router;