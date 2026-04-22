const express = require('express');
const aiDataController = require('./aiDataController');
const router = express.Router();

router.post('/save', aiDataController.createAiData);

module.exports = router;