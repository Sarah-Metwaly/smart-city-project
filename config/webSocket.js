const { WebSocketServer } = require('ws');
const incidentService = require('../modules/incidents/incidentService');
const { activeIncidents } = require('../shared/utils/incidentCashe'); 
const Incident = require('../modules/incidents/IncidentModel'); 

let wss;
const init = (server) => {
    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', async (ws) => {
    console.log('🔌 Frontend client connected');
    try {
        const activeIds = Object.values(activeIncidents);
        const incidents = activeIds.length > 0 
            ? await Incident.find({ _id: { $in: activeIds } })
            : [];
        ws.send(JSON.stringify({ 
            topic: 'active_incidents',
            data: incidents
        }));
    } catch (error) {
        console.error('❌ [WS] Failed to send initial sync data:', error);
    }
})}
const broadcast = (topic, data) => {
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ topic, data }));
        }
    });
};

module.exports = { init, broadcast };

// const { WebSocketServer } = require('ws');

// let wss;

// const init = (server) => {
//     wss = new WebSocketServer({ server, path: '/ws' });
//     wss.on('connection', (ws) => {
//         console.log('🔌 Frontend client connected');
//     });
// };

// const broadcast = (topic, data) => {
//     wss.clients.forEach(client => {
//         if (client.readyState === 1) {
//             client.send(JSON.stringify({ topic, data }));
//         }
//     });
// };

// module.exports = { init, broadcast };