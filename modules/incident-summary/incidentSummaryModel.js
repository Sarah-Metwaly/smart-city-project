const mongoose = require('mongoose');
const IncidentSummarySchema = new mongoose.Schema({

  date: {
    type: String,        
    required: true,
    unique: true,
    index: true
  },

  total:          { type: Number, default: 0 },
  highPriority:   { type: Number, default: 0 }, 
  mediumPriority: { type: Number, default: 0 },
  lowPriority:    { type: Number, default: 0 },

  weaponIncidents:   { type: Number, default: 0 },
  behaviorIncidents: { type: Number, default: 0 },
  fireIncidents:     { type: Number, default: 0 },

  timestamp: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('IncidentSummary', IncidentSummarySchema);