const {latestData} = require('../../config/mqtt');

const getLatestSnapshot = async () => {
  return {
    temperature: latestData['smartcity/dht11']?.temperature,
    humidity: latestData['smartcity/dht11']?.humidity,
    pressure: latestData['smartcity/bmp180']?.pressure,
    airAnalysis: {
      level: latestData['smartcity/mq135']?.air_quality.level,
      score: latestData['smartcity/mq135']?.air_quality.score,
      status: latestData['smartcity/mq135']?.status,
    },
    timestamp: new Date()
  }
}

module.exports = {
  getLatestSnapshot
};
