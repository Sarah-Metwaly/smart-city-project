const catchAsync = require('../../shared/utils/catchAsync');
const { generateSummary, getPoliceSummary, getWeeklyTrend , getDailyStats } = require('./incidentSummaryService');

const generate = catchAsync(async (req, res) => {
  const summary = await generateSummary(req.query.date);
  if (!summary) return res.status(404).json({ success: false, message: 'No incidents found for this date' });
  res.json({ success: true, data: summary });
});

const policeSummary = catchAsync(async (req, res) => {
  const summary = await getPoliceSummary(req.query.date);
  if (!summary) return res.status(404).json({ success: false, message: 'No summary found for this date' });
  res.json({ success: true, data: summary });
});

const dailyCrimeComparison = catchAsync(async (req, res) => {
  const stats = await getDailyStats();
  res.json({ success: true, data: stats });
});

module.exports = {
  generate,
  policeSummary,
  dailyCrimeComparison,
};