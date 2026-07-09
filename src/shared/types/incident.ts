export interface Incident {
  id: string;
  incidentId: string;
  type:
    | 'MEDICAL_EMERGENCY' | 'CROWD_MANAGEMENT' | 'THEFT_DETECTION'
    | 'SMOKE_DETECTION' | 'POOR_AIR_QUALITY' | 'HIGH_HUMIDITY'
    | 'FIRE_DETECTION' | 'LOW_PRESSURE' | 'HIGH_PRESSURE'
    | 'WEAPON_DETECTION' | 'BEHAVIOR_ANOMALY' | 'ENERGY_ANOMALY'
    | 'CITIZEN_CALL' | 'MANUAL_REPORT' | 'HIGH_TEMPERATURE';

  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'FALSE_ALARM' | 'AI CLEARED-AWAITING CONFIRMATION';

  location: {
    type: 'Point';
    coordinates: [number, number];
    name?: string;
    zone?: string;
  };

  media?: {
    images: string[];
    videos: string[];
    liveFeedUrl: string | null;
  };

  source: {
    type: 'SENSOR' | 'AI' | 'MANUAL' | 'CITIZEN';
    deviceId?: string;
    cameraId?: string;
    userId?: string;
  };

  aiData?: {
    detected?: boolean;
    items?: string[];
    confidence?: number;
    incident_image_url?: string;
    priority?: string;
  };

  sensorData?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
