const catchAsync = require('../../shared/utils/catchAsync');
const { generateSummary, getPoliceSummary, getWeeklyTrend , getDailyStats , getActiveIncidentsForMap, getAvgResponseTime} = require('./incidentSummaryService');

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

const weeklyTrend = catchAsync(async (req, res) => {
  const data = await getWeeklyTrend();
  res.json({ success: true, data });
});

const avgResponseTime = catchAsync(async (req, res) => {
  const data = await getAvgResponseTime(req.query.date);
  res.json({ success: true, data });
});

const ActiveIncidentsMap = catchAsync(async (req, res) => {
  const data = await getActiveIncidentsForMap(req.query);

  res.json({
    success: true,
    data: data 
  });
});

module.exports = {
  generate,
  policeSummary,
  dailyCrimeComparison,
  weeklyTrend,
  avgResponseTime,
  ActiveIncidentsMap
};