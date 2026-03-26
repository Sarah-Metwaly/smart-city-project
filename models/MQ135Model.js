const mongoose = require('mongoose');

const MQ135Schema = new mongoose.Schema({
    sensor_id: {
        type : String,
        required : true,
        trim: true
    },
    nh3: {
        type: Number,
        required: true,
        min: 0
    },
    benzene: {
        type: Number,
        required: true,
        min: 0
    },
    alcohol:{
        type: Number,
        required: true,
        min: 0
    },
    smoke:{
        type: Number,
        required: true,
        min: 0
    },
    co2:{
        type: Number,
        required: true,
        min: 0
    },
    co:{
        type: Number,
        required: true,
        min: 0
    },
    air_quality: {
        type: String,
        required: true,
        enum: ['GOOD', 'MODERATE', 'POOR' , 'HAZARDOUS']
    },
    status: {
        type: String,
        required: true ,
        enum: ['NORMAL', 'FAULTY']
    },
    power : {
        type: Number,
        required: true,
        min: 0
    },
    timeStamp : {
        type: Date,
        default: Date.now
    }
});

MQ135Schema.index({ timeStamp: 1 }, { expireAfterSeconds: 172800 });

const MQ135 = mongoose.model('MQ135' ,MQ135Schema);
module.exports = MQ135;