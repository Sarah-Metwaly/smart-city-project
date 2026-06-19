const express = require('express');
const cookieParser = require('cookie-parser');
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
const signUpRoutes = require('./modules/userAuth/signUp/signUpRoute');
const verifyEmailRoutes = require('./modules/userAuth/verifyEmail/verifyEmailRoute');
const logInRoutes = require('./modules/userAuth/logIn/logInRoutes');
const authenticate = require('./modules/userAuth/middleware/authenticate');
const authorize = require('./modules/userAuth/middleware/authorize');
const refreshTokenRoutes = require('./modules/userAuth/refreshToken/refreshTokenRoutes');
const logOutRoutes = require('./modules/userAuth/logOut/logOutRoute');
const forgotPasswordRoutes = require('./modules/userAuth/forgotPassword/forgotPasswordRoute');
const resetPasswordRoutes = require('./modules/userAuth/resetPassword/resetPasswordRoutes');
const incidentSummaryRoutes = require('./modules/incident-summary/incidentSummaryRoutes');
const dangerZoneRoutes = require('./modules/dangerZone/dangerZoneRoutes');
const createOfficerRoutes = require('./modules/userAuth/createOfficer/createOfficerRoutes');
const listUsersRoutes = require('./modules/userAuth/listUsers/listUsersRoutes');
const deactivateUserRoutes = require('./modules/userAuth/deactivateUser/deactivateUserRoutes');
const activateUserRoutes = require('./modules/userAuth/activateUser/activateUserRoutes');
const changePasswordRoutes = require('./modules/userAuth/changePassword/changePasswordRoutes');
const hardDeleteRoutes = require('./modules/userAuth/hardDelete/hardDeleteRoutes');

const app = express();

app.use(cookieParser())
//app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors()); //To allow access from the frontEnd Local host
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//To authorize any path
//app.use('/api/v1/ldr',authenticate.authenticate, authorize.isAdmin, ldrRoutes);

app.use('/api/v1/ldr' , ldrRoutes);
app.use('/api/v1/dht11', dht11Routes);
app.use('/api/v1/bmp180', bmp180Routes);
app.use('/api/v1/mq135', mq135Routes);
app.use('/api/v1/summary', dailySummaryRoutes);
app.use('/api/v1/flame', flameRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/auth', signUpRoutes);
app.use('/api/v1/auth', verifyEmailRoutes);
app.use('/api/v1/auth', logInRoutes);
app.use('/api/v1/auth' , refreshTokenRoutes);
app.use('/api/v1/auth' , logOutRoutes);
app.use('/api/v1/auth' , forgotPasswordRoutes);
app.use('/api/v1/auth' , resetPasswordRoutes);
app.use('/api/v1/incident-summary', incidentSummaryRoutes);
app.use('/api/v1/dangerZones', dangerZoneRoutes);
app.use('/api/v1/auth/admin' , createOfficerRoutes);
app.use('/api/v1/auth/admin' , listUsersRoutes);
app.use('/api/v1/auth/admin' , deactivateUserRoutes);
app.use('/api/v1/auth/admin' , activateUserRoutes);
app.use('/api/v1/auth' , changePasswordRoutes);
app.use('/api/v1/auth/admin' , hardDeleteRoutes);

//Handle all the routes that are not defined in our app and send an error message to the client.
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;