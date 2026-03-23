const BMP180 = require('../models/bmp180Model');

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