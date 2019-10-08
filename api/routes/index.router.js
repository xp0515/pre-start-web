const express = require('express');

const router = express.Router();

const itemController = require('../controllers/item.controller');
const vehicleController = require('../controllers/vehicle.controller');
const userController = require('../controllers/user.controller');
const planController = require('../controllers/plan.controller');
const inspectionController = require('../controllers/inspection.controller');

//item resource
router.get('/items', itemController.getItems);
router.get('/items/:id', itemController.getItem);
router.post('/item', itemController.postItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

//vehicle resource
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/:id', vehicleController.getVehicle);
router.post('/vehicle', vehicleController.postVehicle);

//plan resource
router.get('/plans', planController.getPlans);
router.get('/plans/:id', planController.getPlan);
router.post('/plan', planController.postPlan);
router.put('/plans/:id', planController.updatePlan);
router.delete('/plans/:id', planController.deletePlan);

//inspection resource
router.get('/inspections', inspectionController.getInspections);
router.get('/inspections/:id', inspectionController.getInspection);
router.delete('/inspections/:id', inspectionController.deleteInspection);

module.exports = router;
