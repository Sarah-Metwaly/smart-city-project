const mongoose = require('mongoose');
//changing file name to MQ135Model.js to avoid confusion with the service file and to follow naming conventions for models

const SensorSchema = new mongoose.Schema(
  {
    sensor_id: String,

    type: String,

    co: Number,
    smoke: String,

    co2: Number,
    benzene: String,

    power: Number,
  },
  { _id: false }
);

const MQ135Schema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    trim: true,
  },

  sensors: [SensorSchema],

  air_quality: {
    aqi: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ['GOOD AIR', 'MODERATE AIR', 'POLLUTION HIGH'],
      required: true,
    },
  },

  status: {
    type: String,
    enum: ['SAFE', 'WARNING', 'DANGER'],
    default: 'SAFE',
  },

  power: {
    type: Number,
    min: 0,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

MQ135Schema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

const MQ135 = mongoose.model('MQ135', MQ135Schema);
module.exports = MQ135;
