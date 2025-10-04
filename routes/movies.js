const express = require('express');
const router = express.Router();
//controller
const moviesController =  require('../controllers/movies');
// const { movieRules, validate } = require('../middleware/validate');

//routes
router.get('/', moviesController.getAll);
router.get('/:id', moviesController.getById);
router.get('/findByTittle', moviesController.getByField);
router.get('/findByActor', moviesController.getByField);
router.get('/findByGenre', moviesController.getByField);
router.get('/findByDirector', moviesController.getByField);


//CRUD
router.post('/', moviesController.createMovie);
router.put('/:id', moviesController.updateMovie);
router.delete('/:id', moviesController.removeMovie);

module.exports = router;