// seedWeeklyHistory.js
// Run once from your backend project root:  node seedWeeklyHistory.js
// Backfills DailySummary documents for the past N days (excluding today,
// which is always computed live) so the weekly chart has real-looking bars.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dailySummaryModel = require('./modules/daily-summary/dailySummaryModel');

dotenv.config({ path: './config.env' });

const DAYS_TO_SEED = 6; // yesterday through 6 days ago (today stays live-computed)

// Adjust these ranges to whatever looks realistic for your setup
const ENERGY_RANGE = { min: 15, max: 45 };   // kWh per day
const COST_PER_KWH = 1.5;                     // match your Settings value

const randomInRange = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

async function seed() {
  await mongoose.connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  );
  console.log('Connected to DB');

  for (let i = 1; i <= DAYS_TO_SEED; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const totalEnergy = randomInRange(ENERGY_RANGE.min, ENERGY_RANGE.max);
    const totalCost = parseFloat((totalEnergy * COST_PER_KWH).toFixed(2));

    await dailySummaryModel.findOneAndUpdate(
      { sensor_id: 'seed-backfill', date },
      {
        $set: {
          sensor_type: 'backfill',
          sensor_id: 'seed-backfill',
          date,
          power: parseFloat((totalEnergy / 24).toFixed(2)), // rough avg power implied by the energy total
          total_energy: totalEnergy,
          total_cost: totalCost,
        },
      },
      { upsert: true, new: true }
    );

    console.log(
      `Seeded ${date.toISOString().split('T')[0]}: ${totalEnergy} kWh, ${totalCost} cost`
    );
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});