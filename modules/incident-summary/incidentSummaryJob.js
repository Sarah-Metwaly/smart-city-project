const cron = require('node-cron');
const { generateSummary } = require('./incidentSummaryService');

// runs every day at 11:59 PM
cron.schedule('59 23 * * *', async () => {
  console.log('[IncidentSummary] Generating daily summary...');
  const today = new Date().toISOString().split('T')[0];
  const summary = await generateSummary(today);
  console.log(`[IncidentSummary] Done — total: ${summary?.total ?? 0}`);
});