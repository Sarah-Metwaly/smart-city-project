const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService'); // هيتبني لاحقاً

class IncidentService {

  async createFromSensor(sensorPayload) {
    console.log(`[IncidentService] Creating incident from SENSOR: ${sensorPayload.sensorId}`);

    const initialSnapshot = await sensorSnapshotService.getLatestSnapshot(
      sensorPayload.location.zone
    );

    const payload = buildIncidentPayload(sensorPayload, initialSnapshot);
    const incident = await Incident.create(payload);

    // إرسال Real-time Broadcast
    global.io.to(['police-room', 'fire-room', 'energy-room']).emit('incident:created', incident);

    return incident;
  }
  async createFromAI(aiPayload) {
    console.log(`[IncidentService] Creating incident from AI: ${aiPayload.type}`);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // البحث عن Incident نشط في نفس الـ Zone خلال آخر 10 دقايق
    const existingIncident = await Incident.findOne({
      'location.zone': aiPayload.location.zone,
      type: { $in: ['FIRE_DETECTION', 'SMOKE_DETECTION', 'GAS_LEAK'] },
      status: { $in: ['ACTIVE', 'DISPATCHED'] },
      createdAt: { $gte: tenMinutesAgo }
    });

    if (existingIncident) {
      return await this.updateExistingWithAI(existingIncident, aiPayload);
    }

    const payload = buildIncidentPayload(aiPayload);
    const incident = await Incident.create(payload);

    global.io.to(['police-room', 'fire-room']).emit('incident:created', incident);

    return incident;
  }

  /**
   * تحديث Incident موجود ببيانات AI جديدة + Fresh Sensor Snapshot
   */
  async updateExistingWithAI(existingIncident, aiPayload) {
    console.log(`[IncidentService] Correlating AI with existing incident: ${existingIncident.incidentId}`);

    const freshSnapshot = await sensorSnapshotService.getLatestSnapshot(
      existingIncident.location.zone
    );

    const updatedIncident = await Incident.findByIdAndUpdate(
      existingIncident._id,
      {
        $set: {
          aiData: {
            ...existingIncident.aiData,
            ...aiPayload.aiData
          },
          sensorData: freshSnapshot,
          media: {
            images: [...(existingIncident.media?.images || []), ...(aiPayload.media?.images || [])],
            videos: [...(existingIncident.media?.videos || []), ...(aiPayload.media?.videos || [])]
          }
        },
        $push: {
          actions: {
            user: 'AI_SYSTEM',
            action: 'CORRELATE',
            note: `AI Detection correlated - Fresh sensor snapshot added at ${new Date().toISOString()}`,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    global.io.to(['police-room', 'fire-room']).emit('incident:updated', updatedIncident);

    return updatedIncident;
  }

  async createFromManual(manualPayload, userId) {
    console.log(`[IncidentService] Creating MANUAL incident by user: ${userId}`);

    const payload = buildIncidentPayload({
      ...manualPayload,
      source: { type: 'MANUAL', userId }
    });

    const incident = await Incident.create(payload);

    global.io.to(['police-room', 'fire-room']).emit('incident:created', incident);

    return incident;
  }

  async updateIncident(id, updateData) {
    const updated = await Incident.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error('Incident not found');

    global.io.to(['police-room', 'fire-room']).emit('incident:updated', updated);
    return updated;
  }
}

module.exports = new IncidentService();
