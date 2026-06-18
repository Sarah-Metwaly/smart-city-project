import React, { useState } from 'react';
import type { DisplayPin } from '../../utils/mapZones';

type RiskLevel = 'high' | 'medium' | 'low';

const RISK_STYLES: Record<RiskLevel, {
  dot: string;
  text: string;
  border: string;
  ring: string;
}> = {
  high:   { 
    dot:    "bg-[#ff4d4d]", 
    text:   "text-[#ff4d4d]", 
    border: "border-[rgba(255,77,77,0.35)]",  
    ring:   "text-[#ff4d4d]" 
  },
  medium: { 
    dot:    "bg-[#f5a623]", 
    text:   "text-[#f5a623]", 
    border: "border-[rgba(245,166,35,0.3)]",  
    ring:   "text-[#f5a623]" 
  },
  low:    { 
    dot:    "bg-[#4caf8a]", 
    text:   "text-[#4caf8a]", 
    border: "border-[rgba(76,175,138,0.28)]", 
    ring:   "text-[#4caf8a]" 
  },
};

const TYPE_LABELS: Record<string, string> = {
  FIRE_DETECTION:      '🔥 FIRE',
  WEAPON_DETECTION:    '🔫 WEAPON',
  THEFT_DETECTION:     '🚨 THEFT',
  SMOKE_DETECTION:     '💨 SMOKE',
  MEDICAL_EMERGENCY:   '🏥 MEDICAL',
  POOR_AIR_QUALITY:    '☁️ AIR',
  CROWD_MANAGEMENT:    '👥 CROWD',
  BEHAVIOR_ANOMALY:    '⚠️ BEHAVIOR',
  MANUAL_REPORT:       '📋 MANUAL',
};

interface PinsLayerProps {
  pins: DisplayPin[];
  filterType?: string;
}

const PinsLayer: React.FC<PinsLayerProps> = ({ pins, filterType }) => {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // filter حسب الـ type لو موجود
  const visiblePins = filterType && filterType !== 'ALL'
    ? pins.filter(p => p.type === filterType)
    : pins;

  return (
    <>
      {visiblePins.map(pin => {
        const rc = RISK_STYLES[pin.priority];
        const isSelected = selectedPin === pin.id;
        const label = TYPE_LABELS[pin.type] || pin.type.replace(/_/g, ' ');

        return (
          <div
            key={pin.id}
            className="absolute flex flex-col items-center z-10 cursor-pointer"
            style={{ 
              left: pin.x, 
              top: pin.y, 
              transform: "translate(-50%,-50%)" 
            }}
            onClick={() => setSelectedPin(isSelected ? null : pin.id)}
          >
            {/* الـ pin dot */}
            <div className={`
              relative w-3 h-3 rounded-full border-2 border-white/20 
              transition-transform duration-200 hover:scale-125
              ${rc.dot}
              ${isSelected ? 'scale-150' : ''}
            `}>
              <span className={`
                absolute -inset-1.5 rounded-full border border-current 
                animate-ping opacity-60 ${rc.ring}
              `} />
            </div>

            {isSelected && (
              <div className={`
                absolute bottom-5 left-1/2 -translate-x-1/2 z-20
                px-2 py-1.5 rounded-lg min-w-max
                bg-[rgba(5,12,16,0.95)] backdrop-blur-sm 
                border ${rc.border}
                animate-in fade-in slide-in-from-bottom-1 duration-150
              `}>
                <p className={`text-[8px] font-bold ${rc.text}`}>{label}</p>
                <p className="text-[7px] text-aman-white mt-0.5">{pin.locationName}</p>
                <p className="text-[7px] text-aman-gray">{pin.incidentId}</p>
                <p className={`text-[7px] font-bold mt-0.5 ${rc.text}`}>
                  {pin.status.replace(/_/g, ' ')}
                </p>
              </div>
            )}

            {!isSelected && (
              <div className={`
                mt-1 px-1.5 py-0.5 rounded 
                bg-[rgba(5,12,16,0.85)] backdrop-blur-sm 
                border ${rc.border} whitespace-nowrap
              `}>
                <p className={`text-[7px] font-bold ${rc.text}`}>{label}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PinsLayer;