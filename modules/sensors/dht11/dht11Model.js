const mongoose = require('mongoose');

const dht11Schema = new mongoose.Schema({
    sensor_id: {
        type : String,
        required : true,
        trim: true
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true ,
        enum: ['NORMAL', 'HIGH_TEMP', 'HIGH_HUMIDITY', 'FAULTY']
    },
    power : {
        type: Number,
        required: true,
    },
    timestamp : {
        type: Date,
        default: Date.now
    }
});

dht11Schema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

const DHT11 = mongoose.model('DHT11' ,dht11Schema);
module.exports = DHT11;