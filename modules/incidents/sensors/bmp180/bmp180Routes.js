const express = require('express');
const bmp180Controller = require('./bmp180Controller');
const router = express.Router();

router.post('/save', bmp180Controller.saveReading);
router.get('/latest', bmp180Controller.getLatestReadings);

module.exports = router;
