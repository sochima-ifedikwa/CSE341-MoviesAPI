const express = require('express');
const router = express.Router();
//controller
const genresController =  require('../controllers/genres');
const { genreRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

//routes
router.get('/', genresController.getAll);
router.get('/:id', genresController.getById);

//CRUD
router.post('/', isAuthenticated, genreRules(), validate, genresController.createGenre);
router.put('/:id', isAuthenticated, genreRules(), validate, genresController.updateGenre);
router.delete('/:id', isAuthenticated, genresController.removeGenre);

module.exports = router;