const BMP180 = require('./bmp180Model');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');
const {
  hasActiveIncident,
  addIncident,
  removeIncident,
  getIncidentId,
  loadActiveIncidents,
} = require('../../../shared/utils/incidentCashe')

exports.saveReading = async (data) => {
  const reading = new BMP180({
    sensor_id: data.sensor_id,
    temperature: data.temperature,
    pressure: data.pressure,
    altitude: data.altitude,
    status: data.status,
    power: data.power,
  });
  return await reading.save();
};

exports.getLatestReadings = async () => {
  const latestReadings = await BMP180.aggregate([
    {
      $sort: {
        timeStamp: -1,
      },
    },
    {
      $group: {
        _id: '$sensor_id',
        temperature: { $first: '$temperature' },
        pressure: { $first: '$pressure' },
        altitude: { $first: '$altitude' },
        status: { $first: '$status' },
        power: { $first: '$power' },
        timeStamp: { $first: '$timeStamp' },
      },
    },
  ]);
  return latestReadings;
};

exports.checkThresholds = async (data) => {
  let incident;
  if (data.status === 'LOW_PRESSURE') {
    await incidentService.upsertFromSensor({
      type: 'LOW_PRESSURE',
      sensorId: data.sensor_id,
      readings: { pressure: data.pressure },
    });
  }
  else if (data.status === 'HIGH_PRESSURE') {
        await incidentService.upsertFromSensor({
            type: 'HIGH_PRESSURE',
            sensorId: data.sensor_id,
            readings: { pressure: data.pressure }
        });
  }
  else if (data.status === 'FAULTY') {
        await incidentService.upsertFromSensor({
            type: 'ENERGY_ANOMALY',
            sensorId: data.sensor_id,
            readings: { status: data.status }
        });
  }
  else{
        await incidentService.resolveFromSensor(data.sensor_id, 'HIGH_PRESSURE');
        await incidentService.resolveFromSensor(data.sensor_id, 'LOW_PRESSURE');
        await incidentService.resolveFromSensor(data.sensor_id, 'ENERGY_ANOMALY');
  }
};
