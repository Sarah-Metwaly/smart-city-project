const express = require('express');
const router = express.Router();
const incidentController = require('./incidentController');
const { validateIncidentMiddleware} = require('../../shared/middlewares/validateIncident');


router.post('/sensor', validateIncidentMiddleware, incidentController.createFromSensor);

router.post('/ai', validateIncidentMiddleware, incidentController.createFromAI);

router.post('/manual', validateIncidentMiddleware, incidentController.createFromManual);

router.put('/:id', validateIncidentMiddleware, incidentController.updateIncident);

router.get('/', incidentController.getAllIncidents);  

router.get('/:id', incidentController.getIncidentById);    


module.exports = router;