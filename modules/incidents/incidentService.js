const Incident = require('./IncidentModel');
const { buildIncidentPayload } = require('../../shared/utils/payloadBuilders');
const sensorSnapshotService = require('../../shared/services/sensorSnapshotService');
const eventEmitter = require('../../shared/utils/eventEmitter');
const {activeIncidents , hasActiveIncident, getIncidentKey , addIncident, removeIncident, getIncidentId , loadActiveIncidents, addAiCachedData ,checkAiCachedData
} = require('../../shared/utils/incidentCashe')

exports.createFromSensor = async (data) => {
  const incident = await Incident.create(data);

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

// exports.createFromManual = async (manualPayload, userId) => {
//   const payload = buildIncidentPayload({
//     ...manualPayload,
//     source: { type: 'MANUAL', userId },
//   });

//   const incident = await Incident.create(payload);
//   eventEmitter.emit('incident:created', incident);
//   return incident;
// };


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

exports.getIncidentById = async (id) => {
  return Incident.findById(id);
};


const getYesterdayCountsFromSummary = async (yesterdayStr) => {
  const summaries = await IncidentSummary.find({ date: yesterdayStr });

  let weapon = 0, fire = 0, behavior = 0;

  summaries.forEach(doc => {
    weapon += doc.weaponIncidents || 0;
    fire += doc.fireIncidents || 0;
    behavior += doc.behaviorIncidents || 0;
  });

  return { weapon, fire, behavior };
};

const getTodayCounts = async (todayStart) => {
  const result = await Incident.aggregate([
    { $match: { createdAt: { $gte: todayStart } } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 }
      }
    }
  ]);

  let weapon = 0, fire = 0, behavior = 0;

  result.forEach(r => {
    if (r._id === 'WEAPON_DETECTION') weapon = r.count;
    else if (r._id === 'FIRE_DETECTION') fire = r.count;
    else if (
      ['THEFT_DETECTION', 'MEDICAL_EMERGENCY', 'CROWD_MANAGEMENT'].includes(r._id)
    ) {
      behavior += r.count;
    }
  });

  return { weapon, fire, behavior };
};

exports.getDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Fetch data
  const todayCounts = await getTodayCounts(today);
  const yesterdayCounts = await getYesterdayCountsFromSummary(yesterdayStr);

  const totalToday =
    todayCounts.weapon +
    todayCounts.fire +
    todayCounts.behavior;

  const calcTodayPercentage = (count) =>
    totalToday ? (count / totalToday) * 100 : 0;

  const calcChange = (today, yesterday) => {
    if (yesterday === 0) {
      return today === 0 ? 0 : 100; // or null if you prefer
    }
    return ((today - yesterday) / yesterday) * 100;
  };

  return {
    weapon: {
      todayPercentage: calcTodayPercentage(todayCounts.weapon),
      changePercentage: calcChange(
        todayCounts.weapon,
        yesterdayCounts.weapon
      ),
    },
    fire: {
      todayPercentage: calcTodayPercentage(todayCounts.fire),
      changePercentage: calcChange(
        todayCounts.fire,
        yesterdayCounts.fire
      ),
    },
    behavior: {
      todayPercentage: calcTodayPercentage(todayCounts.behavior),
      changePercentage: calcChange(
        todayCounts.behavior,
        yesterdayCounts.behavior
      ),
    },
  };
};