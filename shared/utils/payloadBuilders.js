const {getZone} = require('./zoneDetector');

const getPriority = (confidence = 0) => {
  if (confidence >= 0.90) return 'CRITICAL';
  if (confidence >= 0.75) return 'HIGH';
  if (confidence >= 0.50) return 'MEDIUM';
  return 'LOW';
};

const SOURCE_TYPE_MAP = {
  FIRE_DETECTION:   'AI',
  GAS_LEAK:         'SENSOR',
  LOW_PRESSURE:     'SENSOR',
  HIGH_TEMPERATURE: 'SENSOR',
  ENERGY_ANOMALY:   'SENSOR',
  SMOKE_DETECTION:  'SENSOR',
  WEAPON_DETECTION: 'AI',
  BEHAVIOR_ANOMALY: 'AI',
  CITIZEN_CALL:     'CITIZEN',
  MANUAL_REPORT:    'MANUAL',
};

const basePayload = (data) => {
  const sourceType = SOURCE_TYPE_MAP[data.type] || 'MANUAL'; 

  return {
    type: data.type,
    status: 'ACTIVE',
    source: {
      type: data.source?.type || sourceType,  
      deviceId: data.sensorId || data.source?.deviceId || null,
      cameraId: data.cameraId || data.source?.cameraId || null,
      userId: data.source?.userId || null
    },

    location:  { type: 'Point', coordinates: [data.location?.coordinates[0] || 0, data.location?.coordinates[1] || 0], name: `${getZone(data.location?.coordinates[0], data.location?.coordinates[1])}` },
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
    priority: data.aiData?.weapon_analysis?.priority || getPriority(data.aiData?.weapon_analysis?.confidence),
    aiData: data.aiData?.weapon_analysis,
    media : {
      images: data.aiData?.weapon_analysis?.incident_image_url 
            ? [data.aiData.weapon_analysis.incident_image_url] 
            : []
    }
  }),

  THEFT_DETECTION: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.behavior_analysis?.confidence),
    aiData: data.aiData?.behavior_analysis,
    media : {
      images: data.aiData?.behavior_analysis?.incident_image_url 
            ? [data.aiData.behavior_analysis.incident_image_url] 
            : []
    }
  }),

  CROWD_MANAGEMENT: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.behavior_analysis?.confidence),
    aiData: data.aiData?.behavior_analysis || {},
    media : {
      images: data.aiData?.behavior_analysis ?.incident_image_url 
            ? [data.aiData.behavior_analysis .incident_image_url] 
            : []
    }
  }),

  MEDICAL_EMERGENCY: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData.behavior_analysis?.confidence),
    aiData: data.aiData?.behavior_analysis ,
    media : {
      images: data.aiData?.behavior_analysis ?.incident_image_url 
            ? [data.aiData.behavior_analysis .incident_image_url] 
            : []
    }
  }),

  FIRE_DETECTION: (data, sensorSnap = {}) => ({
    ...basePayload(data),
    priority: data.aiData?.fire_analysis?.priority || getPriority(data.aiData.fire_analysis?.confidence),
    aiData: data.aiData?.fire_analysis ,
    sensorData: sensorSnap,  
    media : {
      images: data.aiData?.fire_analysis?.incident_image_url 
            ? [data.aiData.fire_analysis.incident_image_url] 
            : []
    } 
  }),

  CITIZEN_CALL: (data) => ({
    ...basePayload(data),
    aiData: data.aiData
  }),

  LOW_PRESSURE: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Pressure dropped to ${data.readings?.pressure} hPa`,
  }),

  HIGH_PRESSURE: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Pressure increased to ${data.readings?.pressure} hPa`,
  }),

  HIGH_HUMIDITY: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Humidity increased to ${data.readings?.humidity} hPa`,
  }),

  HIGH_TEMPERATURE: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Temperature reached ${data.readings?.temperature}°C`,
  }),

  POOR_AIR_QUALITY: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Air quality is ${data.readings?.air_quality}`,
  }),

  ENERGY_ANOMALY: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Sensor is ${data.readings?.status}`,
  }),

  SMOKE_DETECTION: (data, snapshot) => ({
    ...basePayload(data),
    priority: getPriority(), //Need to determine priority later based on a check
    sensorData: snapshot,
    notes: `Smoke detected with risk level ${data.readings?.risk_level}`,
  }), 

  MANUAL_REPORT: (data) => ({
    ...basePayload(data),
    status: 'DISPATCHED', 
    priority: data.priority || 'LOW',
    notes: data.notes || '',
    location: data.location || { type: 'Point', coordinates: [0, 0], name: 'Unknown' },
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