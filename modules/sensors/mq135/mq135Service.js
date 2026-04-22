const mq135Model = require('./mq135Model');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');

exports.saveReading = async (data) => {
    const incident = await exports.checkThresholds(data);
    const reading = new mq135Model({
        device_id: data.device_id,
        sensors: data.sensors,
        air_quality: data.air_quality,
        status: data.status,
        power: data.power,
    });
    return await reading.save();
}

exports.getLatestReadings = async () =>{
    const latestReadings = await mq135Model.aggregate([
        {
            $sort : {
                timestamp : -1  
            }
        },
        {
            $group : {
                _id : "$device_id",
                sensors: { $first: "$sensors" },
                air_quality: { $first: "$air_quality" },
                status: { $first: "$status" },
                power: { $first: "$power" },
                timestamp: { $first: "$timestamp" }
            }
        }
    ]);
    return latestReadings;
}


exports.checkThresholds = async (data) => {
  let incident;
  if (data.air_quality.level === 'POLLUTION HIGH' || data.status === 'DANGER') {
    incident = await incidentService.createFromSensor({
      type: 'POOR_AIR_QUALITY',
      sensorId: data.sensor_id,
      readings: { air_quality: data.air_quality.level }
    });
  }
  eventEmitter.emit('incident:created', incident);
  return incident;
};