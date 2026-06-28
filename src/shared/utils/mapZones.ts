import type { DangerZone } from '../api/dangerZones.api';
import type { Incident } from '../types/incident';

type RiskLevel = 'high' | 'medium' | 'low';

// ── Danger Zones (Heat Map) ──────────────────────────────

// Maps danger percentage to a discrete risk level
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

// ── Zone Layout (aligned with backend) ───────────────────
// Physical model: 50cm width × 70cm height
// Divided into 8 zones (4 columns × 2 rows)

const ZONES = [
  { name: 'zone_1', xMin: 0,  xMax: 12, yMin: 0,  yMax: 35, x: "68%", y: "35%" },
  { name: 'zone_2', xMin: 12, xMax: 25, yMin: 0,  yMax: 35, x: "50%", y: "56%" },
  { name: 'zone_3', xMin: 25, xMax: 37, yMin: 0,  yMax: 35, x: "56%", y: "20%" },
  { name: 'zone_4', xMin: 37, xMax: 50, yMin: 0,  yMax: 35, x: "17%", y: "63%" },
  { name: 'zone_5', xMin: 0,  xMax: 12, yMin: 35, yMax: 70, x: "30%", y: "45%" },
  { name: 'zone_6', xMin: 12, xMax: 25, yMin: 35, yMax: 70, x: "75%", y: "60%" },
  { name: 'zone_7', xMin: 25, xMax: 37, yMin: 35, yMax: 70, x: "40%", y: "25%" },
  { name: 'zone_8', xMin: 37, xMax: 50, yMin: 35, yMax: 70, x: "60%", y: "75%" },
];

// Helper to get zone name from coordinates
const getZone = (x: number, y: number): string => {
  const zone = ZONES.find(z =>
    x >= z.xMin && x < z.xMax &&
    y >= z.yMin && y < z.yMax
  );
  return zone ? zone.name : 'unknown';
};

// Converts raw database summaries into structured coordinate blocks for the heat map layout
export const mapZonesToDisplay = (zones: DangerZone[]): DisplayZone[] => {
  return zones
    .filter(zone => ZONES.find(z => z.name === zone.zone))
    .map(zone => {
      const pos = ZONES.find(z => z.name === zone.zone)!;
      return {
        id: zone.zone,
        x: pos.x,
        y: pos.y,
        risk: getRiskLevel(zone.percentage),
        size: getSize(zone.percentage),
      };
    });
};

// ── Active Incidents (Pins) ──────────────────────────────

// Normalizes backend priority strings to frontend risk level keys
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

// Transforms active incoming incidents into individual pinned points with structural layout offsets
export const mapIncidentsToPins = (incidents: Incident[]): DisplayPin[] => {
  return incidents
    .map(inc => {
      // لو الـ backend مرجع zone مباشرة نستخدمه، لو لأ نحسبه من الإحداثيات
      const zoneName = inc.location?.zone || getZone(
        inc.location?.coordinates?.[0] || 0,
        inc.location?.coordinates?.[1] || 0
      );

      const pos = ZONES.find(z => z.name === zoneName);
      if (!pos) return null;

      // Introduce a slight pixel offset to prevent pins from stacked overlap in the same zone center
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;

      return {
        id: inc._id,
        incidentId: inc.incidentId,
        type: inc.type,
        priority: PRIORITY_TO_RISK[inc.priority?.toUpperCase()] || 'low',
        status: inc.status,
        locationName: inc.location?.name || zoneName,
        zone: zoneName,
        x: `calc(${pos.x} + ${offsetX}px)`,
        y: `calc(${pos.y} + ${offsetY}px)`,
      };
    })
    .filter(Boolean) as DisplayPin[];
};
