const mongoose = require('mongoose');

const FlameSchema = new mongoose.Schema({
    sensor_id: {
        type : String,
        required : true,
        trim: true
    },
    status: {
        type: String,
        required: true ,
        enum: ['NO FLAME', 'SMALL FLAME', 'FLAME DETECTED']
    },
    risk_level : {
        type: String,
        required: true,
        enum: ['SAFE', 'WARNING', 'DANGER']
    },
    is_flame_detected : {
        type: Boolean,
        required: true
    },
    power: {
        type: Number,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

FlameSchema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

const FlameModel = mongoose.model('Flame', FlameSchema);

module.exports = FlameModel;