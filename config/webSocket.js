const { Server } = require('socket.io');
const eventEmitter = require('../shared/utils/eventEmitter');

let io;
const init = (server) => {
    io = new Server(server, {
        cors: { origin: "*" } 
    });

    io.on('connection', (socket) => {
        console.log('🔌 New Client Connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected');
        });
    });

    eventEmitter.on('incident:created', (incident) => {
        if (incident) {
            emitIncident(incident);
        }
    });

    return io;
};

const emitIncident = (incident) => {
    if (io) {
        io.emit('new-incident', incident); 
        console.log(`📡 Incident [${incident.type}] sent to all connected clients`);
    }
};

module.exports = { init, emitIncident };