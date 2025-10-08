const express = require('express');
const router = express.Router();
//controller
const moviesController =  require('../controllers/movies');
const { movieRules, validate } = require('../middleware/validate');

//routes
router.get('/', moviesController.getAll);
router.get('/findByTitle/:title', moviesController.getByField);
router.get('/findByActor/:actors', moviesController.getByField);
router.get('/findByGenre/:genres', moviesController.getByField);
router.get('/findByDirector/:director', moviesController.getByField);
router.get('/:id', moviesController.getById); //This must be last to avoid conflict with other routes. Do not move it please.


//CRUD
router.post('/', movieRules(), validate, moviesController.createMovie);
router.put('/:id', movieRules(), validate, moviesController.updateMovie);
router.delete('/:id', moviesController.removeMovie);

module.exports = router;