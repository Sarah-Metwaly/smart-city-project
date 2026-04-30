const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService');
const eventEmitter = require('../../shared/utils/eventEmitter');
const {
activeIncidents , hasActiveIncident, getIncidentKey , addIncident, removeIncident, getIncidentId , loadActiveIncidents, addAiCachedData ,checkAiCachedData
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

exports.createFromAI = async (payload) => {
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
    { returnDocument: 'after' }
  );

  removeIncident(sensorId,type);
  eventEmitter.emit('incident:resolved', resolved);
  return resolved;
};

exports.upsertFromAi=async (aiPayload)=>{
  //build incident 
  let sensorSnap = {};
  if (aiPayload.type === 'FIRE_DETECTION') {
    sensorSnap = await sensorSnapshotService.getLatestSnapshot();
    //console.log("DEBUG Snapshot:", sensorSnap);
  }
  const payload = buildIncidentPayload(aiPayload, sensorSnap);

  const deviceId=aiPayload.source.deviceId;
  const aiData = payload.aiData;

  //If incident is Active / cached.
  if(hasActiveIncident(deviceId, payload.type)){
    checkAiCachedData(deviceId, payload.type , aiData);
    exports.updateFromAi(activeIncidents[getIncidentKey(deviceId, payload.type)] , aiData)
  }
  else{ //No active/cached incident.
    const incident = await exports.createFromAI(payload);
    addIncident(deviceId, payload.type, incident._id);
    addAiCachedData(deviceId, payload.type, aiData);
  }
}

exports.updateFromAi = async (IncidentId , UpdatedAiData) =>{
  const updated = await Incident.findByIdAndUpdate(
    IncidentId ,
    {
      $set:{
        priority: UpdatedAiData.priority,
        aiData : UpdatedAiData
      }
    },
    { returnDocument: 'after' }
  );
  eventEmitter.emit('incident:updated' , updated);
  return updated;
}

exports.aiClearedAwaitingConfirmation = async (deviceId, type) => {
  const incidentId = getIncidentId(deviceId, type);
  const cleared = await Incident.findByIdAndUpdate(
    incidentId,
    {
      $set: { status: 'AI CLEARED-AWAITING CONFIRMATION', resolvedAt: new Date() },
      $push: {
        actions: {
          user: 'SYSTEM',
          action: 'AI CLEARED-AWAITING CONFIRMATION',
          note: 'AI cleared to normal',
          timestamp: new Date(),
        },
      },
    },
    { returnDocument: 'after' }
  );

  removeIncident(deviceId,type);
  eventEmitter.emit('incident:AI CLEARED-AWAITING CONFIRMATION', cleared);
  return cleared;
};

exports.getAllIncidents = async (query) => {
  return Incident.find(query);
};

exports.getIncidentById = async (id) => {
  return Incident.findById(id);
};
