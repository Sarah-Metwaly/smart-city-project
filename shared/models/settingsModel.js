const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    cost_per_kwh: {
        type: Number,
        required: true,
        min: 0,
        default: 1.5
    }
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;