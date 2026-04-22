const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const IncidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    default: () => `INC-${uuidv4().split('-')[0].toUpperCase()}`,
    unique: true,
    index: true,
  },

  type: {
    type: String,
    enum: [,'SMOKE_DETECTION' , 'POOR_AIR_QUALITY','HIGH_HUMIDITY' , 'FIRE_DETECTION', "LOW_PRESSURE", "HIGH_PRESSURE" ,'WEAPON_DETECTION',  'BEHAVIOR_ANOMALY',     
      'ENERGY_ANOMALY', 'CITIZEN_CALL',   'MANUAL_REPORT'
    ],
    required: true,
    index: true,
  },

  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
    index: true,
  },

  status: {
    type: String,
     enum: ['ACTIVE', 'DISPATCHED', 'RESOLVED', 'CLOSED', 'FALSE_ALARM'],
     default: 'ACTIVE',
    index: true,
  },
  source: {
    type: { type: String, enum: ['SENSOR', 'AI', 'MANUAL', 'CITIZEN'], required: true },
    deviceId: String,
    cameraId: String,
    raspberryPiId: String,
    userId: String,
  },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    name: String,
    zone: String,
  },

  // AI Data → Flexible field to store AI-specific info (model name, confidence, etc.)
  aiData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Sensor Snapshot → Flexible field to store the initial sensor readings at the time of incident creation
  //  (e.g., temperature, humidity, air quality, etc.)
  sensorData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  media: {
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    liveFeedUrl: { type: String, default: null },
  },

  actions: [{
    user: { type: String, default: 'SYSTEM' },
    action: { type: String, enum: ['CREATE', 'DISPATCH', 'RESOLVE', 'CLOSE', 'FALSE_ALARM', 'CORRELATE'] },    note: String,
    timestamp: { type: Date, default: Date.now },
  }],

  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }],

  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  resolvedAt: Date,
  notes: String,

}, { 
  timestamps: true 
});

// Indexes
// IncidentSchema.index({ location: '2dsphere' });
IncidentSchema.index({ type: 1, priority: 1, status: 1, createdAt: -1 });

IncidentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'RESOLVED') {
    this.resolvedAt = new Date();
  }
});

module.exports = mongoose.model('Incident', IncidentSchema);