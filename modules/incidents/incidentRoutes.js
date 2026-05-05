const express = require('express');
const router = express.Router();
const {getAllIncidents} = require('./incidentController');
const validateMiddleware = require('../../shared/middlewares/validate');
const { incidentSchema } = require('./incidentValidation');


// router.post('/sensor', validateMiddleware.validate(incidentSchema), incidentController.createFromSensor);

// router.post('/ai', validateMiddleware.validate(incidentSchema), incidentController.createFromAI);

// router.post('/manual', validateMiddleware.validate(incidentSchema), incidentController.createFromManual);

// router.put('/:id', validateMiddleware.validate(incidentSchema), incidentController.updateIncident);

// router.get('/', incidentController.getAllIncidents);

// router.get('/:id', incidentController.getIncidentById); 

router.get('/DailyIncidents', getAllIncidents);  

module.exports = router;