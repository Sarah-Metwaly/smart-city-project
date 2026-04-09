const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { validateIncident } = require('../middlewares/validateIncident');

router.post('/sensor', validateIncident, incidentController.createFromSensor);

router.post('/ai', validateIncident, incidentController.createFromAI);

router.post('/manual', validateIncident, incidentController.createFromManual);

// Update incident (مثلاً تغيير status أو إضافة notes)
router.put('/:id', incidentController.updateIncident);

module.exports = router;