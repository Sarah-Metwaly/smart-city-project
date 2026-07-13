import React, { useState } from 'react';
import { useDangerZones }       from '../../hooks/useDangerZones';
import { useLiveIncidentStore } from '../../../store/useLiveIncidentStore';
import { mapZonesToDisplay, mapIncidentsToPins } from '../../utils/mapZones';
import HeatMapLayer from './HeatMapLayer';
import PinsLayer    from './PinsLayer';

type ViewMode = 'heat' | 'pins' | 'both';

interface CitySurveillanceMapProps {
  filterType?: string;
}

const CitySurveillanceMap: React.FC<CitySurveillanceMapProps> = ({ filterType }) => {
  const [mode, setMode] = useState<ViewMode>('both');

  // ── Heat map data (React Query) ──
  const { data: zoneData, isLoading, isError } = useDangerZones();
  const heatZones = zoneData ? mapZonesToDisplay(zoneData) : [];

  const { activeIncidents } = useLiveIncidentStore();
  const pins = mapIncidentsToPins(activeIncidents);

  const showHeat = mode === 'heat' || mode === 'both';
  const showPins = mode === 'pins' || mode === 'both';

  return (
    <div className="flex flex-col h-full">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(30,58,70,0.7)] shrink-0">
        <span className="text-[10px] font-medium tracking-[2px] uppercase text-aman-white">
          City Surveillance Map
        </span>
        <div className="flex bg-aman-teal border border-[rgba(30,58,70,0.8)] rounded overflow-hidden">
          {(['heat', 'pins', 'both'] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[8px] font-bold tracking-wide uppercase transition-all duration-150
                border-r last:border-r-0 border-[rgba(30,58,70,0.7)]
                ${mode === m 
                  ? 'bg-aman-dark text-aman-white' 
                  : 'bg-transparent text-aman-gray hover:text-aman-light'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAP AREA ── */}
      <div 
        className="relative flex-1 overflow-hidden" 
        style={{ background: "#050c10", minHeight: "200px" }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            backgroundImage: "linear-gradient(rgba(126,207,207,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(126,207,207,0.04) 1px,transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        />

        {/* Grid lines */}
        {[28, 55, 78].map(t => (
          <div key={t} className="absolute left-0 right-0 h-px z-2" 
            style={{ top: `${t}%`, background: "rgba(30,58,70,0.5)" }} />
        ))}
        {[32, 65].map(l => (
          <div key={l} className="absolute top-0 bottom-0 w-px z-2" 
            style={{ left: `${l}%`, background: "rgba(30,58,70,0.5)" }} />
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-[9px] text-aman-gray tracking-widest animate-pulse">
              LOADING ZONE DATA...
            </span>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-[9px] text-red-500 tracking-widest">
              FAILED TO LOAD ZONES
            </span>
          </div>
        )}

        {/* Layers */}
        {!isLoading && !isError && (
          <>
            {showHeat && <HeatMapLayer zones={heatZones} />}
            {showPins && (
              <PinsLayer 
                pins={pins} 
                filterType={filterType} 
              />
            )}
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="flex items-center justify-between px-3.5 py-2 border-t border-[rgba(30,58,70,0.7)] shrink-0">
        <div className="flex items-center gap-1.5 text-[8px] text-aman-gray">
          <span>LOW</span>
          <div 
            className="h-1 rounded-full w-14" 
            style={{ background: "linear-gradient(to right,rgba(76,175,138,0.6),rgba(245,166,35,0.6),rgba(255,77,77,0.8))" }} 
          />
          <span>HIGH</span>
        </div>
        <div className="flex gap-3">
          <span className="text-[8px] text-aman-gray tracking-[1px]">
            ZONES <span className="text-white">{heatZones.length}</span>
          </span>
          <span className="text-[8px] text-aman-gray tracking-[1px]">
            ACTIVE <span className="text-red-400">{pins.length}</span>
          </span>
        </div>
      </div>

    </div>
  );
};

export default CitySurveillanceMap;