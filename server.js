const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
  .then(() => {console.log('DB connected') 
    mqtt.init();
    websocket.init(server);
  })
  .catch((err) => console.log(err));
