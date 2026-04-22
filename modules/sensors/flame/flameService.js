const flameModel = require('./flameModel');
const incidentService = require('../../incidents/incidentService');
const eventEmitter = require('../../../shared/utils/eventEmitter');

exports.saveReading = async (data) => {
    const incident = await exports.checkThresholds(data);
    const reading = new flameModel({
        sensor_id: data.sensor_id,
        status: data.status,
        risk_level: data.risk_level,
        is_flame_detected: data.is_flame_detected
    });
    return await reading.save();
}

exports.getLatestReadings = async () =>{
    const latestReadings = await flameModel.aggregate([
        {
            $sort : {
                timeStamp : -1      
            }
        },      
        {
            $group : {
                _id : "$sensor_id",
                status : { $first : "$status" },
                risk_level : { $first : "$risk_level" },
                is_flame_detected : { $first : "$is_flame_detected" },
                timeStamp : { $first : "$timeStamp" }
            }   
        }
    ]);
    return latestReadings;
}   

exports.checkThresholds = async (data) => {
    let incident;
    if (data.is_flame_detected) {
        incident = await incidentService.createFromSensor({
            type: 'SMOKE_DETECTION',
            sensorId: data.sensor_id,
            readings: { status: data.status, risk_level: data.risk_level }
        });
    } 
    eventEmitter.emit('incident:created', incident);
    return incident;
};