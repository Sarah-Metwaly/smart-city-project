const mongoose = require('mongoose');

const bmp180Schema = new mongoose.Schema({
    sensor_id: {
        type : String,
        required : true,
        trim: true
    },
    temperature: {
        type: Number,
        required: true,
        min: 0,
        max: 65
    },
    pressure: {
        type: Number,
        required: true,
        min: 300,
        max: 1100
    },
    altitude:{
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true ,
        enum: ['NORMAL', 'HIGH_PRESSURE', 'LOW_PRESSURE', 'FAULTY']
    },
    power : {
        type: Number,
        required: true,
    },
    timeStamp : {
        type: Date,
        default: Date.now
    }
});

bmp180Schema.index({ timeStamp: 1 }, { expireAfterSeconds: 86400 });

const BMP180 = mongoose.model('BMP180' ,bmp180Schema);
module.exports = BMP180;