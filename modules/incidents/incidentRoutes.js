const express = require('express');
const router = express.Router();
const incidentController = require('./incidentController');

router.post('/sensor',  incidentController.createFromSensor);

router.post('/ai', incidentController.createFromAI);

router.post('/manual', incidentController.createFromManual);

router.put('/:id', incidentController.updateIncident);

router.get('/', incidentController.getAllIncidents);  
    
router.get('/:id', incidentController.getIncidentById);    


module.exports = router;