const BMP180 = require('./bmp180Model');
const incidentService = require('../../incidentService');
const eventEmitter = require('../../../../shared/utils/eventEmitter');

exports.saveReading = async (data) => {
    const reading = new BMP180({
        sensor_id: data.sensor_id,
        temperature: data.temperature,
        pressure: data.pressure,
        altitude: data.altitude,
        status: data.status,
        power: data.power
    });
    return await reading.save();
}   

exports.getLatestReadings = async () =>{
    const latestReadings = await BMP180.aggregate([
        {
            $sort : {
                timeStamp : -1
            }
        },
        {
            $group : {
                _id : "$sensor_id",
                temperature : { $first : "$temperature" },
                pressure : { $first : "$pressure" },
                altitude : { $first : "$altitude" },
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
  if (data.pressure < 950) {
  incident =  await incidentService.createFromSensor({
      type: 'LOW_PRESSURE',
      sensorId: data.sensor_id,
      readings: { pressure: data.pressure }
    });
  }
  if (data.temperature > 45) {
  incident =  await incidentService.createFromSensor({
      type: 'HIGH_TEMPERATURE',
      sensorId: data.sensor_id,
      readings: { temperature: data.temperature }
    });
  }
    eventEmitter.emit('incident:created', incident);
  return incident;
};