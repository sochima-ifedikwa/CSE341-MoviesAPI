const express = require('express');
const router = express.Router();
//controller
const directorsController =  require('../controllers/directors');
const { directorRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

//routes
router.get('/', directorsController.getAll);
router.get('/:id', directorsController.getById);

//CRUD
router.post('/', isAuthenticated, directorRules(), validate, directorsController.createDirector);
router.put('/:id', isAuthenticated, directorRules(), validate, directorsController.updateDirector);
router.delete('/:id', isAuthenticated, directorsController.removeDirector);

module.exports = router;