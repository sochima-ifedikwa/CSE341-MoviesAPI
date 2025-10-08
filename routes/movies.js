const express = require('express');
const router = express.Router();
//controller
const moviesController =  require('../controllers/movies');
const { movieRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

//routes
router.get('/', moviesController.getAll);
router.get('/:id', moviesController.getById);
router.get('/findByTitle', moviesController.getByField);
router.get('/findByActor', moviesController.getByField);
router.get('/findByGenre', moviesController.getByField);
router.get('/findByDirector', moviesController.getByField);


//CRUD
router.post('/', isAuthenticated, movieRules(), validate, moviesController.createMovie);
router.put('/:id', isAuthenticated, movieRules(), validate, moviesController.updateMovie);
router.delete('/:id', isAuthenticated, moviesController.removeMovie);

module.exports = router;