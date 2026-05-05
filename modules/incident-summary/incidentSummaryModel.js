const mongoose = require('mongoose');

const IncidentSummarySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    zone: {
        type: String,
        required: true,
        enum: ['zone_1', 'zone_2', 'zone_3', 'zone_4', 'zone_5', 'zone_6', 'zone_7', 'zone_8']
    },
    total: { type: Number, default: 0 },
    highPriority: { type: Number, default: 0 },
    mediumPriority: { type: Number, default: 0 },
    lowPriority: { type: Number, default: 0 },
    weaponIncidents: { type: Number, default: 0 },
    behaviorIncidents: { type: Number, default: 0 },
    fireIncidents: { type: Number, default: 0 },
    dangerScore: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// One summary per zone per day
IncidentSummarySchema.index({ date: 1, zone: 1 }, { unique: true });

module.exports = mongoose.model('IncidentSummary', IncidentSummarySchema);