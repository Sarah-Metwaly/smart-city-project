const {latestData} = require('../../config/mqtt');

const getLatestSnapshot = async () => {
  return {
    temperature: latestData['smartcity/dht11']?.temperature,
    humidity: latestData['smartcity/dht11']?.humidity,
    airAnalysis: {
      level: latestData['smartcity/mq135']?.air_quality.level,
      aqi: latestData['smartcity/mq135']?.air_quality.aqi,
      status: latestData['smartcity/mq135']?.status,
      co: latestData['smartcity/mq135']?.sensors[0]?.co,
      smoke: latestData['smartcity/mq135']?.sensors[0]?.smoke,
      co2: latestData['smartcity/mq135']?.sensors[1]?.co2,
      benzene: latestData['smartcity/mq135']?.sensors[1]?.benzene,
    },
    timestamp: new Date()
  }
}

module.exports = {
  getLatestSnapshot
};
