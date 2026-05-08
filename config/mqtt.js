const mqtt = require('mqtt');
const ldrService = require('../modules/sensors/ldr/ldrService');
const dht11Service = require('../modules/sensors/dht11/dht11Service');
const bmp180Service = require('../modules/sensors/bmp180/bmp180Service');
const mq135Service = require('../modules/sensors/mq135/mq135Service');
const flameService = require('../modules/sensors/flame/flameService');
const aiDataService=require('../modules/aiData/aiDataService');
const { broadcast } = require('./webSocket');

//Throttling - filtering the saving of the input data to manage the storage.
const lastSaveTime={};
const shouldSave = (sensorId)=>{
    const now = Date.now();
    const lastSave=lastSaveTime[sensorId];
    //If never saved or last save was more than 1 hour ago
    if(!lastSave || now-lastSave >=60*60*1000){
        lastSaveTime[sensorId]= now;
        return true;
    }
    return false;
}

//save latest data from each topic
const latestData={};

//const BROKER_URL = 'mqtt://localhost:1883'; 
//To connect to the raspberry pi , which is not in the same network , Connect to a cloud 
const BROKER_URL = `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`; 

const TOPICS = [
    'smartcity/streetlight1',
    'smartcity/dht11',
    'smartcity/bmp180',
    'smartcity/mq135',
    'smartcity/flame',
    'ai/fullDetection'
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

    client.on('message', async (topic, message) => {
        const payload = message.toString().trim();

        console.log("RAW:", payload);

        if (!payload) {
        console.log("⚠️ Empty payload received");
        return; 
        }

        const data = JSON.parse(payload);
        console.log(`📥 Message received on ${topic}:`, data);

        if (topic === 'smartcity/streetlight1') {
            latestData[topic]=data;
            if(shouldSave(data.sensor_id)) await ldrService.saveReading(data);
            await ldrService.checkThresholds(data);
            broadcast('ldr', data);
        }
        if (topic === 'smartcity/dht11') {
            latestData[topic]=data;
            if(shouldSave(data.sensor_id)) await dht11Service.saveReading(data); 
            await dht11Service.checkThresholds(data);
            broadcast('dht11', data);       
        }
        if (topic === 'smartcity/bmp180') {
            latestData[topic]=data;
            if(shouldSave(data.sensor_id))await bmp180Service.saveReading(data);
            await bmp180Service.checkThresholds(data);
            broadcast('bmp180', data);
        }
        if (topic === 'smartcity/mq135') {
            latestData[topic]=data;
            if(shouldSave(data.sensor_id)) await mq135Service.saveReading(data);
            await mq135Service.checkThresholds(data);
            broadcast('mq135', data);
        }
        if(topic === 'smartcity/flame') {
            latestData[topic]=data;
            if(shouldSave(data.sensor_id)) await flameService.saveReading(data);
            await flameService.checkThresholds(data);
            broadcast('flame', data);
        }
        if(topic==='ai/fullDetection'){
            await aiDataService.detectActiveIncidents(data);
        }  
        // add new sensors here later
    });

    client.on('error', (err) => {
        console.log('❌ MQTT error:', err);
    });

    client.on('disconnect', () => {
        console.log('⚠️ MQTT disconnected');
    });
};

module.exports = { init , latestData };