const express = require('express');
const router = express.Router();
//controller
const directorsController =  require('../controllers/directors');
const { directorRules, validate } = require('../middleware/validate');

//routes
router.get('/', directorsController.getAll);
router.get('/:id', directorsController.getById);

//CRUD
router.post('/', directorRules(), validate, directorsController.createDirector);
router.put('/:id', directorRules(), validate, directorsController.updateDirector);
router.delete('/:id', directorsController.removeDirector);

module.exports = router;