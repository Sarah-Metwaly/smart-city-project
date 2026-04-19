const mqtt = require('mqtt');
const ldrService = require('../modules/sensors/ldr/ldrService');
const dht11Service = require('../modules/sensors/dht11/dht11Service');
const bmp180Service = require('../modules/sensors/bmp180/bmp180Service');
const mq135Service = require('../modules/sensors/mq135/mq135Service');
const mq135Controller = require('../modules/sensors/mq135/mq135Controller');
const { broadcast } = require('./webSocket');

//const BROKER_URL = 'mqtt://localhost:1883'; 
//To connect to the raspberry pi , which is not in the same network , Connect to a cloud 
const BROKER_URL = `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`; 

const TOPICS = [
    'smartcity/streetlight1',
    'smartcity/dht11',
    'smartcity/bmp180',
    'smartcity/mq135',
    // add new sensors here later
    // 'sensors/temperature',
    // 'sensors/motion',
];

let client;

const init = () => {
    client = mqtt.connect(BROKER_URL, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        rejectUnauthorized: false
    });

    client.on('connect', () => {
        console.log('✅ MQTT connected to broker');
        TOPICS.forEach(topic => {
            client.subscribe(topic, (err) => {
                if (!err) console.log(`📡 Subscribed to ${topic}`);
                else console.log(`❌ Failed to subscribe to ${topic}:`, err);
            });
        });
    });

    client.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());
        console.log(`📥 Message received on ${topic}:`, data);

        if (topic === 'smartcity/streetlight1') {
            ldrService.saveReading(data);
            broadcast('ldr', data);
        }
        if (topic === 'smartcity/dht11') {
            dht11Service.saveReading(data); 
            broadcast('dht11', data);       
        }
        if (topic === 'smartcity/bmp180') {
            bmp180Service.saveReading(data);
            broadcast('bmp180', data);
        }
        if (topic === 'smartcity/mq135') {
            mq135Service.saveReading(data);
            broadcast('mq135', data);
        }   
    });

    client.on('error', (err) => {
        console.log('❌ MQTT error:', err);
    });

    client.on('disconnect', () => {
        console.log('⚠️ MQTT disconnected');
    });
};

module.exports = { init };