const dailySummaryController = require('./dailySummaryController');
const express = require('express');
const router = express.Router();

router.get('/weekly', dailySummaryController.getWeeklyConsumption);
router.get('/today', dailySummaryController.getTodaySummary);
router.get('/comparison', dailySummaryController.getDailyComparison);

module.exports = router;