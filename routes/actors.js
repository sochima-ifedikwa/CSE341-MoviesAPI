const express = require('express');
const router = express.Router();
//controller
const actorsController =  require('../controllers/actors');
const { actorRules, validate } = require('../middleware/validate');
const { isAuthenticated} = require('../middleware/authenticate');

//routes
router.get('/', actorsController.getAll);
router.get('/:id', actorsController.getById);

//CRUD
router.post('/', isAuthenticated, actorRules(), validate, actorsController.createActor);
router.put('/:id', isAuthenticated, actorRules(), validate, actorsController.updateActor);
router.delete('/:id', isAuthenticated, actorsController.removeActor);

module.exports = router;