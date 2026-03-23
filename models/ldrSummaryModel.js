const mongoose = require('mongoose');

const ldrSummarySchema = new mongoose.Schema({
    sensor_id: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    avg_power: {
        type: Number,
        required: true,
        min: 0
    },
    total_power: {
        type: Number,
        required: true,
        min: 0
    },
    total_cost: {
        type: Number,
        required: true,
        min: 0
    },
    on_count: {
        type: Number,
        default: 0
    },
    off_count: {
        type: Number,
        default: 0
    },
    faulty_count: {
        type: Number,
        default: 0
    }
});

// One summary per sensor per day
ldrSummarySchema.index({ sensor_id: 1, date: 1 }, { unique: true });

const LDRSummary = mongoose.model('LDRSummary', ldrSummarySchema);
module.exports = LDRSummary;