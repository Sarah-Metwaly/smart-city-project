const express = require('express');
const ldrController = require('../controllers/ldrController');
const router = express.Router();

router.post('/save', ldrController.saveReading);
router.get('/status', ldrController.getSensorStatus);
router.get('/totalActiveLoad' , ldrController.getTotalActiveLoad);

module.exports = router;