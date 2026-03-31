const mq135Model = require('../models/mq135Model');

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
                timestamp : -1      
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