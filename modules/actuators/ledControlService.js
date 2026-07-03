const eventEmitter = require('../../shared/utils/eventEmitter');
const { publish } = require('../../config/mqtt');

const TOPIC = 'smartcity/actuators/led';

// Which physical station LED(s) light up per incident type
const TARGETS = {
  WEAPON_DETECTION: ['police'],
  FIRE_DETECTION: ['police', 'fire'],
};

const toggle = (incident, state) => {
  if (incident.source?.type !== 'AI') return; // AI-sourced only
  const targets = TARGETS[incident.type];
  if (!targets) return; // not a type that drives the LEDs

  targets.forEach((target) => publish(TOPIC, { target, state }));
};

eventEmitter.on('incident:created', (incident) => toggle(incident, 'ON'));
eventEmitter.on('incident:resolved', (incident) => toggle(incident, 'OFF'));
eventEmitter.on('incident:AI CLEARED-AWAITING CONFIRMATION',
  (incident) => toggle(incident, 'OFF'));