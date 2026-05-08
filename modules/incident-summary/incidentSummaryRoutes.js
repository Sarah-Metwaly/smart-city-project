const express = require('express');
const router = express.Router();
const { generate, policeSummary, weeklyTrend , dailyCrimeComparison,avgResponseTime, ActiveIncidentsMap } = require('./incidentSummaryController');

router.get('/generate', generate);       // GET /api/v1/incident-summary/generate?date=2026-05-01
router.get('/police', policeSummary);  // GET /api/v1/incident-summary/police?date=2026-05-01
router.get('/dailyCrimeComparison', dailyCrimeComparison); // GET /api/v1/incident-summary/dailyCrimeComparison
router.get('/weekly-trend', weeklyTrend);  //GET /api/v1/incident-summary/weekly-trend

module.exports = router;