const mongoose = require('mongoose');

const ldrSchema = new mongoose.Schema({
    sensor_id: {
        type : String,
        required : true,
        trim: true
    },
    ldr_value: {
        type: Number,
        required: true,
        min: 0,
        max: 1023
    },
    status: {
        type: String,
        required: true,
        enum: ['ON', 'OFF', 'Faulty']
    },
    power: {
        type: Number,
        required: true,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

//We set an index on the timestamp , So that any document older than 48 hours will be deleted.
ldrSchema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 }); 

const LDR = mongoose.model('LDR', ldrSchema);
module.exports = LDR;