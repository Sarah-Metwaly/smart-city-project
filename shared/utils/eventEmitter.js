const EventEmitter = require('events');
const {broadcast} = require('../../config/webSocket');

const eventEmitter = new EventEmitter();

eventEmitter.on('incident:created', (incident) => {
    broadcast('incident', incident);
});

module.exports = eventEmitter;