class SensorSnapshotService {
  // بنمرر السيرفسز الخاصة بالسنسورات هنا
  async getLatestSnapshot(zone, dht11Service, mq135Service, bmp180Service) {
    try {
      console.log(`[SensorService] Collecting real-time data for zone: ${zone}`);

      // ✅ تنفيذ جلب البيانات بالتوازي (Parallel fetching)
      const [dhtData, mqData, bmpData] = await Promise.all([
        dht11Service.getLatestReadings(zone),
        mq135Service.getLatestReadings(zone),
        bmp180Service.getLatestReadings(zone)
      ]);

      // ✅ بناء الـ Snapshot بناءً على الـ Hardware Schema الحقيقي
      return {
        zone: zone,
        timestamp: new Date(),
        // بناخد أول نتيجة راجعة من كل سنسور في المنطقة دي
        dht11: dhtData?.[0] ? {
          sensor_id: dhtData[0].sensor_id,
          temperature: dhtData[0].temperature,
          humidity: dhtData[0].humidity,
          status: dhtData[0].status
        } : null,

        mq135: mqData?.[0] ? {
          sensor_id: mqData[0].sensor_id,
          smoke: mqData[0].smoke,
          co2: mqData[0].co2,
          air_quality: mqData[0].air_quality,
          status: mqData[0].status
        } : null,

        bmp180: bmpData?.[0] ? {
          sensor_id: bmpData[0].sensor_id,
          pressure: bmpData[0].pressure,
          altitude: bmpData[0].altitude
        } : null,

        summary: {
          isAnomalyDetected: (dhtData?.[0]?.temperature > 50 || mqData?.[0]?.smoke > 200)
        }
      };
    } catch (error) {
      console.error('Snapshot failed:', error);
      return { zone, error: 'Hardware sync failed' };
    }
  }
}

module.exports = new SensorSnapshotService();