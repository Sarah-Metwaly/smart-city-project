const LDR = require('./ldrModel');
const {
  hasActiveIncident,
  addIncident,
  removeIncident,
  getIncidentId,
  loadActiveIncidents,
} = require('../../../shared/utils/incidentCashe')

exports.saveReading = async (data) => {
    const reading = new LDR({
        sensor_id: data.sensor_id,
        ldr_value: data.ldr_value,
        status: data.status,
        power: data.power
    });
    return await reading.save();
};

exports.getSensorStatus = async () => {
    const TotalNumber= await LDR.aggregate([
        {
            $sort : {
                timestamp : -1
            }
        },
        {
            $group : {
                _id : "$sensor_id",
                status : { $first : "$status" },
                power : { $first : "$power" }
            }
        }
    ]);
    return {"total": TotalNumber.length , "on" : TotalNumber.filter(sensor => sensor.status === 'ON').length , "off" : TotalNumber.filter(sensor => sensor.status === 'OFF').length , "faulty" : TotalNumber.filter(sensor => sensor.status === 'Faulty').length};
}; 

exports.getTotalActiveLoad = async () => {
    const activeLoad = await LDR.aggregate([
        {
            $sort : {
                timestamp : -1
            }
        },
        {
            $group : {
                _id : "$sensor_id",
                power : { $first : "$power"},
                status : { $first : "$status"}
            }
        }
    ]);
    const onSensors = activeLoad.filter(sensor => sensor.status === 'ON');
    const total = onSensors.reduce((sum , sensor)=> sum+sensor.power , 0); 
    return total;
}

exports.checkThresholds = async (data) => {
    if (data.status === 'Faulty') {
        await incidentService.upsertFromSensor({
            type: 'ENERGY_ANOMALY',
            sensorId: data.sensor_id,
            readings: { status: data.status }
        });
    } else {
        await incidentService.resolveFromSensor(data.sensor_id, 'ENERGY_ANOMALY');
    }
};