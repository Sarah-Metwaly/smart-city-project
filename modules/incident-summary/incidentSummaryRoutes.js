const express = require('express');
const router = express.Router();
const { generate, policeSummary, weeklyTrend } = require('./incidentSummaryController');
console.log('✅ Incident Summary Routes Loaded!');
router.get('/generate', generate);       // GET /api/incident-summary/generate?date=2026-05-01
router.get('/police', policeSummary);  // GET /api/incident-summary/police?date=2026-05-01

module.exports = router;