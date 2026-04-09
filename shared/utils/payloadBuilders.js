const getPriority = (confidence = 0) => {
  if (confidence >= 0.90) return 'CRITICAL';
  if (confidence >= 0.75) return 'HIGH';
  if (confidence >= 0.50) return 'MEDIUM';
  return 'LOW';
};

const basePayload = (data) => {
  let sourceType = 'MANUAL'; 
  if (data.type.includes('FIRE') || data.type.includes('GAS')) sourceType = 'SENSOR';
  if (data.type.includes('WEAPON') || data.type.includes('BEHAVIOR')) sourceType = 'AI';
  if (data.type === 'CITIZEN_CALL') sourceType = 'CITIZEN';

  return {
    type: data.type,
    priority: data.priority || getPriority(data.confidence),
    status: 'ACTIVE',
    
    source: {
      type: data.source?.type || sourceType, 
      deviceId: data.sensorId || data.source?.deviceId || null,
      cameraId: data.cameraId || data.source?.cameraId || null,
      userId: data.source?.userId || null
    },

   location: data.location || { type: 'Point', coordinates: [0, 0], name: 'Unknown' },
    actions: [{
      user: 'SYSTEM',
      action: 'CREATE',
      note: `Incident automatically initialized via ${sourceType}`,
      timestamp: new Date()
    }]
  };
};

const builders = {
  WEAPON_DETECTION: (data) => ({
    ...basePayload(data),
    aiData: {
      modelName: 'weapon_detection',
      confidence: data.confidence,
      detectedClass: 'weapon',
      boundingBox: data.boundingBox,
      frameUrl: data.frameUrl
    },
    media: {
      images: data.frameUrl ? [data.frameUrl] : [],
      videos: []
    }
  }),

  BEHAVIOR_ANOMALY: (data) => ({
    ...basePayload(data),
    aiData: {
      modelName: 'behavior_analysis',
      confidence: data.confidence,
      detectedClass: data.behaviorType,
      personCount: data.personCount,
      clipUrl: data.clipUrl
    },
    media: {
      videos: data.clipUrl ? [data.clipUrl] : []
    }
  }),

  FIRE_DETECTION: (data, sensorSnap = {}) => ({
    ...basePayload(data),
    aiData: {
      modelName: 'fire_detection',
      confidence: data.confidence,
      flameDetected: true,
      frameUrl: data.frameUrl
    },
    sensorData: sensorSnap,           
    media: {
      images: data.frameUrl ? [data.frameUrl] : []
    }
  }),

  CITIZEN_CALL: (data) => ({
    ...basePayload(data),
    aiData: {
      modelName: 'call_analysis',
      transcript: data.transcript,
      keywords: data.keywords,
      urgency: data.urgency,
      audioUrl: data.audioUrl
    }
  })
};

const buildIncidentPayload = (data, sensorSnap = {}) => {
  const builder = builders[data.type];
  if (!builder) throw new Error(`No builder for type: ${data.type}`);
  return builder(data, sensorSnap);
};

module.exports = {
  buildIncidentPayload,
  getPriority,
  builders
};