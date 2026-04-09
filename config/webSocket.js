const { Server } = require('socket.io');
let io;
const init = (server) => {
    io = new Server(server, {
        cors: { origin: "*" } 
    });
    io.on('connection', (socket) => {
        console.log('🔌 New Client Connected:', socket.id);
      // Listen for room join requests (مثل: fire-room, weapon-room) من الـ Frontend عشان يقدروا يستقبلوا الحوادث المتخصصة  
        socket.on('join-room', (roomName) => {
            socket.join(roomName);
            console.log(`👥 Client ${socket.id} joined: ${roomName}`);
        });
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected');
        });
    });
    return io;
};

// Function to emit new incidents to specific rooms and to a global monitor room
const emitIncident = (roomName, incident) => {
    if (io) {
        io.to(roomName).emit('new-incident', incident);
        io.to('global-monitor').emit('new-incident', incident);
        console.log(`📡 Incident sent to: ${roomName} & global-monitor`);
    }
};

module.exports = { init, emitIncident };