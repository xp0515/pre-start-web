const express = require('express');

const router = express.Router();

const itemController = require('../controllers/item.controller');
const vehicleController = require('../controllers/vehicle.controller');
const userController = require('../controllers/user.controller');
const planController = require('../controllers/plan.controller');
const inspectionController = require('../controllers/inspection.controller');

const checkAuth = require('../middleware/check-auth');

//item resource
router.get('/items', checkAuth.verifyJwtToken, itemController.getItems);
router.get('/items/:id', checkAuth.verifyJwtToken, itemController.getItem);
router.post('/item', checkAuth.verifyJwtToken, itemController.postItem);
router.put('/items/:id', checkAuth.verifyJwtToken, itemController.updateItem);
router.delete('/items/:id', checkAuth.verifyJwtToken, itemController.deleteItem);

//vehicle resource
router.get('/vehicles', checkAuth.verifyJwtToken, vehicleController.getVehicles);
router.get('/vehicles/:id', checkAuth.verifyJwtToken, vehicleController.getVehicle);
router.post('/vehicle', checkAuth.verifyJwtToken, vehicleController.postVehicle);

//plan resource
router.get('/plans', checkAuth.verifyJwtToken, planController.getPlans);
router.get('/plans/:id', checkAuth.verifyJwtToken, planController.getPlan);
router.post('/plan', checkAuth.verifyJwtToken, planController.postPlan);
router.put('/plans/:id', checkAuth.verifyJwtToken, planController.updatePlan);
router.delete('/plans/:id', checkAuth.verifyJwtToken, planController.deletePlan);

//inspection resource
router.get('/inspections', checkAuth.verifyJwtToken, inspectionController.getInspections);
router.get('/inspections/:id', checkAuth.verifyJwtToken, inspectionController.getInspection);
router.delete('/inspections/:id', checkAuth.verifyJwtToken, inspectionController.deleteInspection);

//user resource
router.post('/user/signup', userController.createUser);
router.post('/user/login', userController.postUser);

module.exports = router;
