const express = require('express');
const mq135Controller = require('../controllers/mq135Controller');
const router = express.Router();

router.post('/save', mq135Controller.saveReading);
router.get('/latest', mq135Controller.getLatestReadings);

module.exports = router;
