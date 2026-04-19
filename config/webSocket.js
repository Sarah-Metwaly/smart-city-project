const { WebSocketServer } = require('ws');

let wss;

const init = (server) => {
    wss = new WebSocketServer({ server, path: '/ws' });
    wss.on('connection', (ws) => {
        console.log('🔌 Frontend client connected');
    });
};

const broadcast = (topic, data) => {
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ topic, data }));
        }
    });
};

module.exports = { init, broadcast };