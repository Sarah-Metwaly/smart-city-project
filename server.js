const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');
const http = require('http'); 
const dailySummaryService = require('./modules/daily-summary/dailySummaryService');

dotenv.config({ path: './config.env' });
const app = require('./app');
// const mqtt = require('./config/mqtt');
const websocket = require('./config/webSocket');

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('DB connected');
    const io = websocket.init(httpServer);

global.io = io; 

app.set('io', io);
    //  Init MQTT after DB is ready
    // mqtt.init();

    cron.schedule('0 0 * * *', async () => { // First 0 is for minutes, second 0 is for hours, * for every day of month, * for every month, * for every day of week
      console.log('⏰ Running daily summary...');
      await dailySummaryService.getDailySummary();
      console.log('✅ Daily summary completed');
    });

    httpServer.listen(port, () => {
      console.log(`App is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1); 
  });