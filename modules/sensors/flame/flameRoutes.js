const flameController = require('./flameController');
const express = require('express');
const router = express.Router();

router.post('/save', flameController.saveReading);
router.get('/latest', flameController.getLatestReadings);

module.exports = router;