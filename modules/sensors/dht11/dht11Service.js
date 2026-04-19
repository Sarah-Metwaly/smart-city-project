const DHT11 = require('./dht11Model');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');

exports.saveReading = async (data) => {
    const incident = await exports.checkThresholds(data);
    const reading = new DHT11({
        sensor_id: data.sensor_id,
        temperature: data.temperature,
        humidity: data.humidity,
        status: data.status,
        power: data.power
    });
    return await reading.save();
}

exports.getLatestReadings = async () =>{
    const latestReadings = await DHT11.aggregate([
        {
            $sort : {
                timeStamp : -1
            }
        },
        {
            $group : {
                _id : "$sensor_id",
                temperature : { $first : "$temperature" },
                humidity : { $first : "$humidity" },
                status : { $first : "$status" },
                power : { $first : "$power" },
                timeStamp : { $first : "$timeStamp" }
            }
        }
    ]);
    return latestReadings;
}


exports.checkThresholds = async (data) => {
  let incident;
  if (data.status === 'HIGH_TEMP') {
    incident = await incidentService.createFromSensor({
    type: 'FIRE_DETECTION',
    sensorId: data.sensor_id,
    readings: { temperature: data.temperature }
});
  }
  if (data.status === 'HIGH_HUMIDITY') {
   incident = await incidentService.createFromSensor({
      type: 'HIGH_HUMIDITY',
      sensorId: data.sensor_id,
      readings: { humidity: data.humidity }
    });
  }
eventEmitter.emit('incident:created', incident);
  return incident;
};