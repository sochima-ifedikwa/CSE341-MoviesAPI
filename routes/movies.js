const express = require('express');
const router = express.Router();
//controller
const moviesController =  require('../controllers/movies');

//routes
router.get('/', moviesController.getAll);
router.get('/findByTittle', moviesController.getByField);
router.get('/findByActor', moviesController.getByField);
router.get('/findByGenre', moviesController.getByField);
router.get('/findByDirector', moviesController.getByField);
router.get('/:id', moviesController.getById);

//CRUD
router.post('/', moviesController.createMovie);
router.put('/:id', moviesController.updateMovie);
router.delete('/:id', moviesController.removeMovie);

module.exports = router;