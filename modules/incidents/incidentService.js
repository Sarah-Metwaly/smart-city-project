const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService');
const eventEmitter = require('../../shared/utils/eventEmitter');
const {
  hasActiveIncident,
  addIncident,
  removeIncident,
  getIncidentId,
  loadActiveIncidents,
} = require('../../shared/utils/incidentCashe')

exports.createFromSensor = async (data) => {
  const payloadWithSource = {
    ...data,
    source: { type: 'SENSOR', sensorId: data.sensorId },
  };

  const initialSnapshot = await sensorSnapshotService.getLatestSnapshot();
  const payload = buildIncidentPayload(payloadWithSource, initialSnapshot);
  const incident = await Incident.create(payload);

  eventEmitter.emit('incident:created', incident);
  return incident;
};

exports.createFromAI = async (aiPayload) => {
  let sensorSnap = {};
  if (aiPayload.type === 'FIRE_DETECTION') {
    sensorSnap = await sensorSnapshotService.getLatestSnapshot();
    //console.log("DEBUG Snapshot:", sensorSnap);
  }

  const payload = buildIncidentPayload(aiPayload, sensorSnap);
  const incident = await Incident.create(payload);

  eventEmitter.emit('incident:created', incident);
  return incident;
};

// exports.updateExistingWithAI = async (existingIncident, aiPayload) => {
//   const freshSnapshot = await sensorSnapshotService.getLatestSnapshot();
//   const updatedIncident = await Incident.findByIdAndUpdate(
//     existingIncident._id,
//     {
//       $set: {
//         aiData: {
//           ...existingIncident.aiData,
//           ...aiPayload.aiData
//         },
//         sensorData: freshSnapshot,
//         media: {
//           images: [...(existingIncident.media?.images || []), ...(aiPayload.media?.images || [])],
//           videos: [...(existingIncident.media?.videos || []), ...(aiPayload.media?.videos || [])]
//         }
//       },
//       $push: {
//         actions: {
//           user: 'AI_SYSTEM',
//           action: 'CORRELATE',
//           note: `AI Detection correlated - Fresh sensor snapshot added at ${new Date().toISOString()}`,
//           timestamp: new Date()
//         }
//       }
//     },
//     { new: true }
//   );

//   eventEmitter.emit('incident:updated', updatedIncident);
//   return updatedIncident;
// };

exports.createFromManual = async (manualPayload, userId) => {
  const payload = buildIncidentPayload({
    ...manualPayload,
    source: { type: 'MANUAL', userId },
  });

  const incident = await Incident.create(payload);
  eventEmitter.emit('incident:created', incident);
  return incident;
};

exports.updateIncident = async (id, updateData) => {
  const updated = await Incident.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updated) throw new Error('Incident not found');

  eventEmitter.emit('incident:updated', updated);
  return updated;
};

exports.upsertFromSensor = async (data) => {
  if (hasActiveIncident(data.sensorId, data.type)) return;

  //create new incident if there is no active incident for it.
  const incident = await exports.createFromSensor(data);
  addIncident(data.sensorId, data.type, incident.incidentId);
  return incident;
};

exports.resolveFromSensor = async (sensorId, type) => {
  if (!hasActiveIncident(sensorId, type)) return; //no active incident to be resolved

  const incidentId = getIncidentId(sensorId, type);
  const resolved = await Incident.findByIdAndUpdate(
    incidentId,
    {
      $set: { status: 'RESOLVED', resolvedAt: new Date() },
      $push: {
        actions: {
          user: 'SYSTEM',
          action: 'RESOLVE',
          note: 'Sensor returned to normal',
          timestamp: new Date(),
        },
      },
    },
    { new: true },
  );

  removeIncident(sensorId,type);
  eventEmitter.emit('incident:resolved', resolved);
  return resolved;
};

exports.getAllIncidents = async (query) => {
  return Incident.find(query);
};

exports.getIncidentById = async (id) => {
  return Incident.findById(id);
};
