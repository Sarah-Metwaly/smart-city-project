const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
    sensor_type:{
        type: String,
        required: true,
        enum: ['LDR', 'DHT11', 'BMP180', 'MQ135']
    },
    sensor_id:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    power: {
        type: Number,
        required: true
    },
    total_energy: {
        type: Number,
        required: true
    },
    total_cost: {
        type: Number,
        required: true
    }
});

dailySummarySchema.index({ sensor_id: 1, date: 1 }, { unique: true });

const DailySummary = mongoose.model('DailySummary', dailySummarySchema);
module.exports = DailySummary;