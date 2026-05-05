const express = require('express');
const router = express.Router();
const dangerZoneController = require('./dangerZoneController');

router.get('/weekly', dangerZoneController.getWeeklyDangerZones);

module.exports = router;