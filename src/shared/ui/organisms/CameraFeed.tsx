import React, { useState } from 'react';
import { useHighestPriorityIncident } from '../../../shared/hooks/useHighestPriorityIncident';

const PRIORITY_ORDER: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const CameraFeed: React.FC = () => {
  const { priorityIncidents, highestPriorityIncident, hasActiveAlert } = useHighestPriorityIncident();

  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  const highestValue = PRIORITY_ORDER[highestPriorityIncident?.priority?.toUpperCase() || ''] || 0;
  const highPriorityCameras = priorityIncidents.filter((incident) => {
    return (PRIORITY_ORDER[incident.priority?.toUpperCase()] || 0) === highestValue;
  });

  
  const camerasToRender = (viewMode === 'single' && highestPriorityIncident) 
    ? [highestPriorityIncident] 
    : highPriorityCameras;

  const isGridStyle = camerasToRender.length > 1;
  const gridClass = isGridStyle ? 'grid grid-cols-2 gap-2 p-2' : 'relative';

  return (
    <div
      className={`flex flex-col w-full h-auto aspect-21/9 max-h-87.5 bg-[#050c10] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 
      ${hasActiveAlert ? 'border-red-500 shadow-red-500/20' : 'border-cyan-500/30'}`}
    >
      {/* ─── HEADER ─── */}
      <div
        className={`flex items-center justify-between p-3 border-b bg-black/60 ${
          hasActiveAlert ? 'border-red-500/20' : 'border-cyan-500/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-2 py-0.5 border rounded text-[9px] font-bold 
            ${hasActiveAlert ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${hasActiveAlert ? 'bg-red-500 animate-ping' : 'bg-cyan-500 animate-pulse'}`}
            ></span>
            AI SURVEILLANCE: {hasActiveAlert ? `${highPriorityCameras.length} ALERTS_ACTIVE` : 'SYSTEM_IDLE'}
          </div>
          
          {camerasToRender.length === 1 && hasActiveAlert && (
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase animate-fade-in">
              {camerasToRender[0]?.incidentId || 'CAM'} — {camerasToRender[0]?.location?.name || 'ZONE'}
            </span>
          )}
        </div>

        {hasActiveAlert && highPriorityCameras.length > 1 && (
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
            className="px-2 py-1 text-[8px] bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 active:scale-95 transition-all rounded text-cyan-400 font-mono font-bold uppercase tracking-wider pointer-events-auto"
          >
            {viewMode === 'single' ? '➔ Show All Cameras' : '➔ Focus Mode'}
          </button>
        )}
      </div>

      {/* ─── VIEWPORT AREA ─── */}
      <div className={`flex-1 overflow-hidden bg-black min-h-0 ${gridClass}`}>
        {hasActiveAlert ? (
          camerasToRender.map((incident) => {
            const lat = incident?.location?.coordinates?.[1] || 30.0444;
            const lng = incident?.location?.coordinates?.[0] || 31.2357;
            
            const incidentImage = 
              incident?.aiData?.incident_image_url || 
              incident?.media?.images?.[0] || 
              null;

            return (
              <div 
                key={incident._id || incident.incidentId} 
                className="relative w-full h-full border border-red-500/10 rounded-xl overflow-hidden bg-[#020608] transition-all duration-300"
              >
                {incidentImage ? (
                  <img
                    src={incidentImage}
                    alt="Live Incident Feed"
                    className="object-cover w-full h-full duration-500 animate-in fade-in"
                    onError={(e) => {
                      console.error('❌ Image failed to load:', incidentImage);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 text-[10px] font-mono">
                    NO_LIVE_STREAM
                  </div>
                )}

                <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pointer-events-none">
                  <div className="text-[9px] font-mono font-bold text-red-400 bg-black/70 px-1.5 py-0.5 rounded w-max border border-red-500/20">
                    {incident?.type?.replace(/_/g, ' ')}
                  </div>
                  
                  <div className="flex justify-between text-[7px] font-mono text-cyan-500 bg-black/80 p-1.5 rounded-md border border-cyan-500/10">
                    <span>CAM: {incident?.incidentId || 'UNKNWN'}</span>
                    <span>LOC: {incident?.location?.name || 'ZONE'}</span>
                    <span>LAT: {lat.toFixed(4)} | LON: {lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <video autoPlay muted loop className="object-cover w-full h-full opacity-40 grayscale">
            <source src="/assets/videos/city-live.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <div className="p-2 bg-black/80 border-t border-cyan-500/10 flex justify-between items-center text-[8px] font-mono text-cyan-700">
        <span>VIEW MODE: {viewMode.toUpperCase()} | PRIORITY LEVEL: {hasActiveAlert ? highestPriorityIncident?.priority : 'NONE'}</span>
        <span>
          {hasActiveAlert ? 'SOURCE: AI_PRIORITY_ROUTING' : 'STATUS: SCANNING...'}
        </span>
      </div>
    </div>
  );
};

export default CameraFeed;