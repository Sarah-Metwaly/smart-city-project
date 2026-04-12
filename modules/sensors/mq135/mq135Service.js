const mq135Model = require('./mq135Model');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');

exports.saveReading = async (data) => {
    const reading = new mq135Model({
        sensor_id: data.sensor_id,
        nh3: data.nh3,
        benzene: data.benzene,
        alcohol: data.alcohol,
        smoke: data.smoke,
        co2: data.co2,
        co: data.co,
        air_quality: data.air_quality,
        status: data.status,
        power: data.power
    });
    return await reading.save();
}

exports.getLatestReadings = async () =>{
    const latestReadings = await mq135Model.aggregate([
        {
            $sort : {
                timeStamp : -1      
            }
        },
        {
            $group : {
                _id : "$sensor_id",
                nh3 : { $first : "$nh3" },
                benzene : { $first : "$benzene" },
                alcohol : { $first : "$alcohol" },
                smoke : { $first : "$smoke" },
                co2 : { $first : "$co2" },
                co : { $first : "$co" },
                air_quality : { $first : "$air_quality" },
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
  if (data.co > 10 || data.smoke > 200) {
  incident =  await incidentService.createFromSensor({
      type: 'AIR_POLLUTION',
      sensorId: data.sensor_id,
      readings: { co: data.co, smoke: data.smoke }
    });
  }
  if (data.air_quality < 50) {
    incident = await incidentService.createFromSensor({
      type: 'POOR_AIR_QUALITY',
      sensorId: data.sensor_id,
      readings: { air_quality: data.air_quality }
    });
  }
  eventEmitter.emit('incident:created', incident);
  return incident;
};