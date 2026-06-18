import type { DangerZone } from '../api/dangerZones.api';
import type { Incident } from '../types/incident';

type RiskLevel = 'high' | 'medium' | 'low';

// ── Danger Zones (Heat Map) ──────────────────────────────


//  Maps danger percentage to a discrete risk level
const getRiskLevel = (percentage: number): RiskLevel => {
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
};


// Calculates the size of the danger glow circle based on severity percentage
const getSize = (percentage: number): number => {
  return Math.round(80 + (percentage / 100) * 80);
};

export interface DisplayZone {
  id: string;
  x: string;
  y: string;
  risk: RiskLevel;
  size: number;
}


//   Static visual center coordinates for each physical zone layout
const ZONE_POSITIONS: Record<string, { x: string; y: string }> = {
  zone_1: { x: "68%", y: "35%" },
  zone_2: { x: "50%", y: "56%" },
  zone_3: { x: "56%", y: "20%" },
  zone_4: { x: "17%", y: "63%" },
  zone_5: { x: "30%", y: "45%" },
  zone_6: { x: "75%", y: "60%" },
  zone_7: { x: "40%", y: "25%" },
  zone_8: { x: "60%", y: "75%" },
};

//   Converts raw database summaries into structured coordinate blocks for the heat map layout
export const mapZonesToDisplay = (zones: DangerZone[]): DisplayZone[] => {
  return zones
    .filter(zone => ZONE_POSITIONS[zone.zone])
    .map(zone => ({
      id: zone.zone,
      x: ZONE_POSITIONS[zone.zone].x,
      y: ZONE_POSITIONS[zone.zone].y,
      risk: getRiskLevel(zone.percentage),
      size: getSize(zone.percentage),
    }));
};

// ── Active Incidents (Pins) ──────────────────────────────

//   Normalizes backend priority strings to frontend risk level keys
const PRIORITY_TO_RISK: Record<string, RiskLevel> = {
  HIGH:   'high',
  MEDIUM: 'medium',
  LOW:    'low',
};

export interface DisplayPin {
  id: string;
  incidentId: string;
  type: string;
  priority: RiskLevel;
  status: string;
  locationName: string;
  zone: string;
  x: string;
  y: string;
}


//   Transforms active incoming incidents into individual pinned points with structural layout offsets
export const mapIncidentsToPins = (incidents: Incident[]): DisplayPin[] => {
  return incidents
    .filter(inc => {
      // Fail-safe: Only include incidents occurring within defined, mapped zones
      const zone = inc.location?.zone || inc.location?.name;
      return zone && ZONE_POSITIONS[zone];
    })
    .map(inc => {
      const zone = inc.location?.zone || inc.location?.name || 'zone_1';
      const position = ZONE_POSITIONS[zone];

      // Introduce a slight pixel offset to prevent pins from stacked overlap in the same zone center
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;

      return {
        id: inc._id,
        incidentId: inc.incidentId,
        type: inc.type,
        priority: PRIORITY_TO_RISK[inc.priority?.toUpperCase()] || 'low',
        status: inc.status,
        locationName: inc.location?.name || zone,
        zone,
        x: `calc(${position.x} + ${offsetX}px)`,
        y: `calc(${position.y} + ${offsetY}px)`,
      };
    });
};