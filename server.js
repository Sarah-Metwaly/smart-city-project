const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');
const dailySummaryService = require('./modules/daily-summary/dailySummaryService');
const {loadActiveIncidents} = require('./shared/utils/incidentCashe')

dotenv.config({ path: './config.env' });
const app = require('./app');
const mqtt = require('./config/mqtt');
const websocket = require('./config/webSocket');


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

mongoose
  .connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD))
  .then(async () => {console.log('DB connected') 
    await loadActiveIncidents(); //loads incident from DB to the cashe.
    mqtt.init();
    websocket.init(server);

    // Run daily summary every day at midnight
    cron.schedule(' 0 0 * * *', async () => { // First 0 is for minutes, second 0 is for hours, * for every day of month, * for every month, * for every day of week
        console.log('⏰ Running daily summary...');
        await dailySummaryService.getDailySummary();
        console.log('✅ Daily summary completed');
    });
  })
  .catch((err) => console.log(err));