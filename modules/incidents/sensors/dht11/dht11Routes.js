const express = require('express');
const dht11Controller = require('./dht11Controller');
const router = express.Router();

router.post('/save', dht11Controller.saveReading);
router.get('/latest', dht11Controller.getLatestReadings);

module.exports = router;