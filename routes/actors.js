const express = require('express');
const router = express.Router();
//controller
const actorsController =  require('../controllers/actors');

//routes
router.get('/', actorsController.getAll);
router.get('/:id', actorsController.getById);

//CRUD
router.post('/', actorsController.createActor);
router.put('/:id', actorsController.updateActor);
router.delete('/:id', actorsController.removeActor);

module.exports = router;