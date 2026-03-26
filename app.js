const express = require('express');
const cors = require('cors');
const ldrRoutes = require('./routes/ldrRoutes');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const dht11Routes = require('./routes/dht11Routes');
const bmp180Routes = require('./routes/bmp180Routes');
const mq135Routes = require('./routes/mq135Routes');
const dailySummaryRoutes = require('./routes/dailySummaryRoutes');

const app = express();

app.use(cors()); //To allow access from the frontEnd Local host
app.use(express.json());
app.use('/api/v1/ldr', ldrRoutes);
app.use('/api/v1/dht11', dht11Routes);
app.use('/api/v1/bmp180', bmp180Routes);
app.use('/api/v1/mq135', mq135Routes);
app.use('/api/v1/summary', dailySummaryRoutes);

app.all('/{*splat}', (req, res, next) => { //Handle all the routes that are not defined in our app and send an error message to the client.
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;