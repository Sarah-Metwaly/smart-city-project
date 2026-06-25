const mq135Model = require('./mq135Model');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');
const {
  hasActiveIncident,
  addIncident,
  removeIncident,
  getIncidentId,
  loadActiveIncidents,
} = require('../../../shared/utils/incidentCashe');

exports.saveReading = async (data) => {
//   console.log('MODEL PATH:');
//   console.dir(mq135Model.schema.path('sensors'), { depth: 3 });

//   console.log('SCHEMA OBJ:');
//   console.dir(mq135Model.schema.obj.sensors, { depth: 3 });

  const reading = new mq135Model({
    device_id: data.device_id,
    sensors: data.sensors,
    air_quality: data.air_quality,
    status: data.status,
    power: data.power,
  });
  return await reading.save();
};

exports.getLatestReadings = async () => {
  const latestReadings = await mq135Model.aggregate([
    {
      $sort: {
        timestamp: -1,
      },
    },
    {
      $group: {
        _id: '$device_id',
        sensors: { $first: '$sensors' },
        air_quality: { $first: '$air_quality' },
        status: { $first: '$status' },
        power: { $first: '$power' },
        timestamp: { $first: '$timestamp' },
      },
    },
  ]);
  return latestReadings;
};

exports.checkThresholds = async (data) => {
  let incident;
  if (data.air_quality.level === 'POLLUTION HIGH' || data.status === 'DANGER') {
    await incidentService.upsertFromSensor({
      type: 'POOR_AIR_QUALITY',
      sensorId: data.sensor_id,
      readings: { air_quality: data.air_quality.level },
    });
  } else {
    await incidentService.resolveFromSensor(data.sensor_id, 'POOR_AIR_QUALITY');
  }
};
