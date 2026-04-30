const { checkThresholds } = require("../../modules/sensors/dht11/dht11Service");

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
    priority: data.aiData?.weapon_analysis?.priority || getPriority(data.aiData?.weapon_analysis?.confidence),
    aiData: data.aiData?.weapon_analysis,
  }),

  THEFT_DETECTION: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: data.aiData?.theft_detection
  }),

  CROWD_MANAGEMENT: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: data.aiData?.crowd_management
  }),

  WRONG_WAY_DETECTION: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: data.aiData?.wrong_way
  }),

  MEDICAL_EMERGENCY: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: data.aiData?.medical_emergency
  }),

  FIRE_DETECTION: (data, sensorSnap = {}) => ({
    ...basePayload(data),
    priority: data.aiData?.fire_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: data.aiData?.fire_analysis ,
    sensorData: sensorSnap,   
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

  HIGH_TEMP: (data, snapshot) => ({
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