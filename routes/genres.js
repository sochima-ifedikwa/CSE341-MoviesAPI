const express = require('express');
const router = express.Router();
//controller
const genresController =  require('../controllers/genres');
const { genreRules, validate } = require('../middleware/validate');

//routes
router.get('/', genresController.getAll);
router.get('/:id', genresController.getById);

//CRUD
router.post('/', genreRules(), validate, genresController.createGenre);
router.put('/:id', genreRules(), validate, genresController.updateGenre);
router.delete('/:id', genresController.removeGenre);

module.exports = router;