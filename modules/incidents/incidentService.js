const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService'); 
// const { validateIncident } = require('../../shared/middlewares/validateIncident');

const createFromSensor = async (sensorPayload) => {
  const initialSnapshot = await sensorSnapshotService.getLatestSnapshot();
  const payload = buildIncidentPayload(sensorPayload, initialSnapshot);
  // validateIncident(payload);

  const incident = await Incident.create(payload);

  // استخدم global.io مباشرة
  global.io.to(['police-room', 'fire-room', 'energy-room']).emit('incident:created', incident);

  return incident;
};

const createFromAI = async (aiPayload) => {
  let sensorSnap = {};
  if (aiPayload.type === 'FIRE_DETECTION') {
    sensorSnap = await sensorSnapshotService.getLatestSnapshot();
    console.log("DEBUG Snapshot:", sensorSnap);
  }

  const payload = buildIncidentPayload(aiPayload, sensorSnap);
  // validateIncident(payload);

  const incident = await Incident.create(payload);

  global.io.to(['police-room', 'fire-room']).emit('incident:created', incident);

  return incident;
};

const updateExistingWithAI = async (existingIncident, aiPayload) => {
  const freshSnapshot = await sensorSnapshotService.getLatestSnapshot();
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
};

const createFromManual = async (manualPayload, userId) => {
  const payload = buildIncidentPayload({
    ...manualPayload,
    source: { type: 'MANUAL', userId }
  });

  // validateIncident(payload);

  const incident = await Incident.create(payload);

  global.io.to(['police-room', 'fire-room']).emit('incident:created', incident);

  return incident;
};

const updateIncident = async (id, updateData) => {
  const updated = await Incident.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) throw new Error('Incident not found');

  global.io.to(['police-room', 'fire-room']).emit('incident:updated', updated);

  return updated;
};

const getAllIncidents = async (query) => {
  return Incident.find(query);
};

const getIncidentById = async (id) => {
  return Incident.findById(id);
};

module.exports = {
  createFromSensor,
  createFromAI,
  updateExistingWithAI,
  createFromManual,
  updateIncident,
  getAllIncidents,
  getIncidentById
};
