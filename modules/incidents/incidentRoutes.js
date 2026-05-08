const express = require('express');
const router = express.Router();
const {getAllIncidents , getAllIncidentsForAdmin} = require('./incidentController');
const validateMiddleware = require('../../shared/middlewares/validate');
const { incidentSchema } = require('./incidentValidation');
const authenticate = require('../userAuth/middleware/authenticate');
const authorize = require('../userAuth/middleware/authorize');


// router.post('/sensor', validateMiddleware.validate(incidentSchema), incidentController.createFromSensor);

// router.post('/ai', validateMiddleware.validate(incidentSchema), incidentController.createFromAI);

// router.post('/manual', validateMiddleware.validate(incidentSchema), incidentController.createFromManual);

// router.put('/:id', validateMiddleware.validate(incidentSchema), incidentController.updateIncident);

// router.get('/', incidentController.getAllIncidents);

// router.get('/:id', incidentController.getIncidentById); 

router.get('/DailyIncidents', getAllIncidents);  

router.get('/AdminIncidents', authenticate.authenticate ,authorize.isAdmin, getAllIncidentsForAdmin);  // New route for admin with filtering capabilities

module.exports = router;