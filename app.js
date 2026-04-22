const express = require('express');
const cors = require('cors');
const ldrRoutes = require('./modules/sensors/ldr/ldrRoutes');
const errorController = require('./shared/controllers/errorController');
const AppError = require('./shared/utils/AppError');
const dht11Routes = require('./modules/sensors/dht11/dht11Routes');
const bmp180Routes = require('./modules/sensors/bmp180/bmp180Routes');
const mq135Routes = require('./modules/sensors/mq135/mq135Routes');
const dailySummaryRoutes = require('./modules/daily-summary/dailySummaryRoutes');
const incidentRoutes = require('./modules/incidents/incidentRoutes');
const flameRoutes = require('./modules/sensors/flame/flameRoutes');
const aiDataRoutes = require('./modules/aiData/aiDataRoutes');

const app = express();

app.use(cors()); //To allow access from the frontEnd Local host
app.use(express.json());

app.use('/api/v1/incidents', incidentRoutes);

app.use('/api/v1/ldr', ldrRoutes);
app.use('/api/v1/dht11', dht11Routes);
app.use('/api/v1/bmp180', bmp180Routes);
app.use('/api/v1/mq135', mq135Routes);
app.use('/api/v1/summary', dailySummaryRoutes);
app.use('/api/v1/flame', flameRoutes);
app.use('/api/v1/ai-data', aiDataRoutes);

//Handle all the routes that are not defined in our app and send an error message to the client.
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;