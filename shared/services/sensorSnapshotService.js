const dht11Service = require('../../modules/sensors/dht11/dht11Service');
const mq135Service = require('../../modules/sensors/mq135/mq135Service');
const bmp180Service = require('../../modules/sensors/bmp180/bmp180Service');

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
    level: mqData[0]?.air_quality.level,
    score: mqData[0]?.air_quality.score,
    status: mqData[0]?.status,
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
