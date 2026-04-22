const mongoose = require('mongoose');
//changing file name to MQ135Model.js to avoid confusion with the service file and to follow naming conventions for models

const MQ135Schema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    trim: true,
  },
  sensors: [
    {
      sensor_id: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        enum: ['mq-2', 'mq-135'],
      },
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: '%',
      },
      power: {
        type: Number,
      },
    },
  ],
  air_quality: {
    level: {
      type: String,
      enum: ['GOOD AIR', 'MODERATE AIR', 'POLLUTION HIGH'],
      required: true,
    },
    score: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['SAFE', 'WARNING', 'DANGER'],
    default: 'SAFE',
  },
  power: { type: Number, min: 0 , required: true },
  timestamp: { type: Date, default: Date.now },
});

MQ135Schema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

const MQ135 = mongoose.model('MQ135', MQ135Schema);
module.exports = MQ135;
