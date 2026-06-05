const EventEmitter = require('events');
const { broadcast } = require('../../config/webSocket');

const eventEmitter = new EventEmitter();

// Incident created
eventEmitter.on('incident:created', (incident) => {
  broadcast('incident:created', incident);
});

// Incident updated
eventEmitter.on('incident:updated', (incident) => {
   console.log("📤 Broadcasting incident update:", incident);
  broadcast('incident:updated', incident);
});

// Incident resolved
eventEmitter.on('incident:resolved', (incident) => {
  broadcast('incident:resolved', incident);
});

// Incident cleared by AI awaiting confirmation
eventEmitter.on('incident:AI CLEARED-AWAITING CONFIRMATION', (incident) => {
  broadcast('incident:AI CLEARED-AWAITING CONFIRMATION', incident);
});

module.exports = eventEmitter;
