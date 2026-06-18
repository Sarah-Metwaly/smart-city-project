import React from 'react';
import type { DisplayZone } from '../../utils/mapZones';

type RiskLevel = 'high' | 'medium' | 'low';

const HEAT_COLORS: Record<RiskLevel, string> = {
  high:   "rgba(255,77,77",
  medium: "rgba(245,166,35",
  low:    "rgba(76,175,138",
};

const getGradient = (risk: RiskLevel, color: string): string => {
  if (risk === 'high') {
    return `radial-gradient(circle,${color},0.4) 0%,${color},0.18) 30%,${color},0.06) 55%,transparent 72%)`;
  }
  if (risk === 'medium') {
    return `radial-gradient(circle,${color},0.3) 0%,${color},0.13) 30%,${color},0.04) 55%,transparent 72%)`;
  }
  return `radial-gradient(circle,${color},0.22) 0%,${color},0.09) 35%,transparent 65%)`;
};

interface HeatMapLayerProps {
  zones: DisplayZone[];
}

const HeatMapLayer: React.FC<HeatMapLayerProps> = ({ zones }) => {
  return (
    <>
      {zones.map(zone => {
        const color = HEAT_COLORS[zone.risk];
        return (
          <div
            key={zone.id}
            className="absolute rounded-full pointer-events-none z-3 animate-pulse"
            style={{
              left:      zone.x,
              top:       zone.y,
              width:     `${zone.size}px`,
              height:    `${zone.size}px`,
              transform: "translate(-50%,-50%)",
              background: getGradient(zone.risk, color),
            }}
          />
        );
      })}
    </>
  );
};

export default HeatMapLayer;