const express = require('express');
const router = express.Router();
//controller
const genresController =  require('../controllers/genres');

//routes
router.get('/', genresController.getAll);
router.get('/:id', genresController.getById);

//CRUD
router.post('/', genresController.createGenre);
router.put('/:id', genresController.updateGenre);
router.delete('/:id', genresController.removeGenre);

module.exports = router;