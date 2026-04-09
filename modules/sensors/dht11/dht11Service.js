const DHT11 = require('./dht11Model');

exports.saveReading = async (data) => {
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

