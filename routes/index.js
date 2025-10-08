const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/actors', require('./actors'));
router.use('/directors', require('./directors'));
router.use('/genres', require('./genres'));
router.use('/movies', require('./movies'));
router.use('/', require('./swagger'));


router.get('/', (req, res) => {
    //#swagger.tags = ['Welcome to the Movies API']
    res.send('<h1>Welcome to the Movies API</h1><p>Use the /actors endpoint to manage actors collection.</p><p>Use the /directors endpoint to manage directors collection.</p><p>Use the /genres endpoint to manage genres collection.</p><p>Use the /movies endpoint to manage movies collection.</p>');
    res.status(200);

});

router.get('/login', passport.authenticate('github'), (req, res) => {})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    })
})


module.exports = router;