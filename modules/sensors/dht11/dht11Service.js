const DHT11 = require('./dht11Model');
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
    await incidentService.upsertFromSensor({
            type: 'HIGH_TEMPERATURE',
            sensorId: data.sensor_id,
            readings: { temperature: data.temperature }
        });
  }
  else if (data.status === 'HIGH_HUMIDITY') {
   await incidentService.upsertFromSensor({
            type: 'HIGH_HUMIDITY',
            sensorId: data.sensor_id,
            readings: { humidity: data.humidity }
        });
  }
  else if (data.status === 'FAULTY') {
        await incidentService.upsertFromSensor({
            type: 'ENERGY_ANOMALY',
            sensorId: data.sensor_id,
            readings: { status: data.status }
        });
    }
    else {
        // Status is NORMAL → resolve all possible incidents
        await incidentService.resolveFromSensor(data.sensor_id, 'HIGH_TEMPERATURE');
        await incidentService.resolveFromSensor(data.sensor_id, 'HIGH_HUMIDITY');
        await incidentService.resolveFromSensor(data.sensor_id, 'ENERGY_ANOMALY');
    }
};