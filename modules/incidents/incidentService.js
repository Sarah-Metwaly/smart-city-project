const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService');
const eventEmitter = require('../../shared/utils/eventEmitter');
const {activeIncidents , hasActiveIncident, getIncidentKey , addIncident, removeIncident, getIncidentId , loadActiveIncidents, addAiCachedData ,checkAiCachedData
} = require('../../shared/utils/incidentCashe')
const { generateSummary } = require('../incident-summary/incidentSummaryService');

exports.createFromSensor = async (data) => {
  const incident = await Incident.create(data);

  await generateSummary(); // Update daily summary immediately after creating an incident from sensor data
  eventEmitter.emit('incident:created', incident);
  return incident;
};

exports.createFromAI = async (payload) => {
  const incident = await Incident.create(payload);

  await generateSummary(); // Update daily summary immediately after creating an incident from AI data
  eventEmitter.emit('incident:created', incident);
  return incident;
};


exports.upsertFromSensor = async (data) => {
    const payloadWithSource = {
    ...data,
    source: { type: 'SENSOR', deviceId: data.sensorId },
  };

  const initialSnapshot = await sensorSnapshotService.getLatestSnapshot();
  const payload = buildIncidentPayload(payloadWithSource, initialSnapshot);
  
  const deviceId=payload.source.deviceId;

  if (hasActiveIncident(deviceId, payload.type)){
      const hasChanged = checkAiCachedData(deviceId, payload.type, initialSnapshot);
      if (hasChanged) {  // FIX: Only update if data actually changed
          const incidentId = getIncidentId(deviceId, payload.type);
          await exports.updateFromSensor(incidentId, initialSnapshot);  // FIX: Use getIncidentId + await
      }
  }
  else{
      const incident = await exports.createFromSensor(payload);
      addIncident(deviceId, payload.type, incident._id.toString());
      addAiCachedData(deviceId, payload.type, initialSnapshot);
  }
};

exports.updateFromSensor = async (IncidentId , snapShot) =>{
  const updated = await Incident.findByIdAndUpdate(
    IncidentId ,
    {
      $set:{
        sensorData : snapShot
      }
    },
    { returnDocument: 'after' }
  );
  eventEmitter.emit('incident:updated' , updated);
  return updated;
}

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

exports.upsertFromAi = async (aiPayload) => {
    let sensorSnap = {};
    if (aiPayload.type === 'FIRE_DETECTION') {
        sensorSnap = await sensorSnapshotService.getLatestSnapshot();
    }
    const payload = buildIncidentPayload(aiPayload, sensorSnap);

    const deviceId = aiPayload.source.deviceId;
    const aiData = payload.aiData;

    if (hasActiveIncident(deviceId, payload.type)) {
        const hasChanged = checkAiCachedData(deviceId, payload.type, aiData);
        if (hasChanged) {  // FIX: Only update if data actually changed
            const incidentId = getIncidentId(deviceId, payload.type);
            await exports.updateFromAi(incidentId, aiData);  // FIX: Use getIncidentId + await
        }
    } else {
        const incident = await exports.createFromAI(payload);
        addIncident(deviceId, payload.type, incident._id.toString());
        addAiCachedData(deviceId, payload.type, aiData);
    }
};

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

//EndPoints for today's incidents with query for filtering
//EndPoints for all incidents with query for filtering
exports.getAllIncidents = async (query) => {
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day

  const filter = {};
  filter.createdAt = { $gte: today }; // Only incidents created today

  if(query.type) filter.type = query.type;
  if(query.status) filter.status = query.status;
  if(query.priority) filter.priority = query.priority;

  return Incident.find(filter).sort({ createdAt: -1 });
};

exports.getAllIncidentsForAdmin = async (query) => {
  const filter = {};
  if(query.type) filter.type = query.type;
  if(query.status) filter.status = query.status;
  if(query.priority) filter.priority = query.priority;

  return Incident.find(filter).sort({ createdAt: -1 });
};

exports.updateIncident = async (incidentId, updateData) => {
  const updated = await Incident.findOneAndUpdate(
    { incidentId: incidentId },
    { $set: { status: updateData.status }  ,
      $push: {
        actions: {
          user: updateData.user || 'SYSTEM', 
          action: updateData.status,
          note: updateData.note || `Incident manually updated via Officer / Admin`,
          timestamp: new Date(),
        },
      },
    },    
    { returnDocument: 'after' }
  );
  if(updated.status === 'RESOLVED' || updated.status === 'AI CLEARED-AWAITING CONFIRMATION' || updated.status === 'FALSE_ALARM') {
    removeIncident(updated.source.deviceId, updated.type);
  }
  eventEmitter.emit('incident:updated', updated);
  return updated;
};

// exports.getIncidentById = async (id) => {
//   return Incident.findById(id);
// };