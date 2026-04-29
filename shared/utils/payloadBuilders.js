const { checkThresholds } = require("../../modules/sensors/dht11/dht11Service");

const getPriority = (confidence = 0) => {
  if (confidence >= 0.90) return 'CRITICAL';
  if (confidence >= 0.75) return 'HIGH';
  if (confidence >= 0.50) return 'MEDIUM';
  return 'LOW';
};

const SOURCE_TYPE_MAP = {
  FIRE_DETECTION:   'SENSOR',
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
    aiData: {
      modelName: 'weapon_detection',
      items: data.aiData?.weapon_analysis?.items || [],
      confidence: data.aiData?.weapon_analysis?.confidence,
      detected:  data.aiData?.weapon_analysis?.detected,
    },
    // media: {
    //   images: data.frameUrl ? [data.frameUrl] : [],
    //   videos: []
    // }
  }),

  THEFT_DETECTION: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: {
      modelName: 'theft_detection',
      confidence: data.aiData?.behavior_analysis?.confidence,
      alert: data.aiData?.behavior_analysis?.alert,
    }
  }),

  CROWD_MANAGEMENT: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: {
      modelName: 'crowd_management',
      count: data.aiData?.behavior_analysis?.count,
      confidence: data.aiData?.behavior_analysis?.confidence,
      isCrowded: data.aiData?.behavior_analysis?.is_crowded,
      threshold: data.aiData?.behavior_analysis?.threshold,
    }
  }),

  WRONG_WAY_DETECTION: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: {
      modelName: 'wrong_way_detection',
      confidence: data.aiData?.behavior_analysis?.confidence,
      detected: data.aiData?.behavior_analysis?.detected,
      direction: data.aiData?.behavior_analysis?.direction,
    }
  }),

  MEDICAL_EMERGENCY: (data) => ({
    ...basePayload(data),
    priority: data.aiData?.behavior_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: {
      modelName: 'medical_emergency',
      confidence: data.aiData?.behavior_analysis?.confidence,
      personDown: data.aiData?.behavior_analysis?.personDown,
      status: data.aiData?.behavior_analysis?.status
    }
  }),

  FIRE_DETECTION: (data, sensorSnap = {}) => ({
    ...basePayload(data),
    priority: data.aiData?.fire_analysis?.priority || getPriority(data.aiData?.confidence),
    aiData: {
      modelName: 'fire_detection',
      detected: data.aiData?.fire_analysis?.detected,
      confidence: data.aiData?.fire_analysis?.confidence,
      danger_level: data.aiData?.fire_analysis?.danger_level,
      fusion_data: {
        smoke_sensor_value: data.aiData?.fire_analysis?.fusion_data?.smoke_sensor_value,
        is_confirmed_by_sensor: data.aiData?.fire_analysis?.fusion_data?.is_confirmed_by_sensor
    },
    sensorData: sensorSnap,   
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