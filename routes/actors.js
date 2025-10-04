const express = require('express');
const router = express.Router();
//controller
const actorsController =  require('../controllers/actors');
const { actorRules, validate } = require('../middleware/validate');

//routes
router.get('/', actorsController.getAll);
router.get('/:id', actorsController.getById);

//CRUD
router.post('/', actorRules(), validate, actorsController.createActor);
router.put('/:id', actorRules(), validate, actorsController.updateActor);
router.delete('/:id', actorsController.removeActor);

module.exports = router;