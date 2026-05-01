const dht11Service = require('../../modules/incidents/sensors/dht11/dht11Service');
const mq135Service = require('../../modules/incidents/sensors/mq135/mq135Service');
const bmp180Service = require('../../modules/incidents/sensors/bmp180/bmp180Service');

const getLatestSnapshot = async () => {
  try {
    const [dhtData, mqData, bmpData] = await Promise.all([
      dht11Service.getLatestReadings(),
      mq135Service.getLatestReadings(),
      bmp180Service.getLatestReadings()
    ]);

 return {
  temperature: dhtData[0]?.temperature,
  humidity: dhtData[0]?.humidity,
  pressure: bmpData[0] ?.pressure,
  airAnalysis: {
    co2: mqData[0]?.co2,
    smoke: mqData[0]?.smoke,
    alcohol: mqData[0]?.alcohol,
    benzene: mqData[0]?.benzene,
    status: mqData[0]?.air_quality 
  },
  timestamp: new Date()
};
  } catch (error) {
    console.error('[SensorSnapshotService] Error capturing snapshot:', error.message);
    return {
      temperature: null,
      humidity: null,
      airQuality: null,
      pressure: null,
      timestamp: new Date(),
      error: "Failed to fetch some sensor data"
    };
  }
};

module.exports = {
  getLatestSnapshot
};
