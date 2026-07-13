import React, { useState } from 'react';
import { useHighestPriorityIncident } from '../../../shared/hooks/useHighestPriorityIncident';
import LiveStream from './LiveStream';

const PRIORITY_ORDER: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const CameraFeed: React.FC = () => {
  const { priorityIncidents, highestPriorityIncident, hasActiveAlert } =
    useHighestPriorityIncident();

  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // Highest priority level
  const highestValue =
    PRIORITY_ORDER[highestPriorityIncident?.priority?.toUpperCase() || ''] || 0;

  const highPriorityCameras = priorityIncidents.filter((incident) => {
    return (
      (PRIORITY_ORDER[incident.priority?.toUpperCase()] || 0) === highestValue
    );
  });

  // Single vs Grid mode
  const camerasToRender =
    viewMode === 'single' && highestPriorityIncident
      ? [highestPriorityIncident]
      : highPriorityCameras;

  const isGridStyle = camerasToRender.length > 1;

  const gridClass = isGridStyle
    ? `
      grid
      grid-cols-1
      sm:grid-cols-2
      gap-2
      p-2
    `
    : 'relative';

  return (
    <div
      className={`w-full h-full
        overflow-hidden
        rounded-2xl
        border
        shadow-2xl
        transition-all
        duration-500
        flex
        flex-col

        aspect-[4/3]
        sm:aspect-video
        xl:aspect-[21/9]

        ${
          hasActiveAlert
            ? 'border-red-500 shadow-red-500/20'
            : 'border-cyan-500/30'
        }
      `}
    >
      {/* ================= HEADER ================= */}
      <div
        className={`flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-2
          p-3
          bg-black/60
          border-b
          ${hasActiveAlert ? 'border-red-500/20' : 'border-cyan-500/10'}
        `}
      >
        <div className="flex flex-wrap items-center min-w-0 gap-2 sm:gap-3">
          <div
            className={`flex items-center gap-2 px-2 py-1 border rounded text-[9px] font-bold whitespace-nowrap
              ${
                hasActiveAlert
                  ? 'bg-red-500/20 border-red-500 text-red-500'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500'
              }
            `}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full
                ${
                  hasActiveAlert
                    ? 'bg-red-500 animate-ping'
                    : 'bg-cyan-500 animate-pulse'
                }
              `}
            />
            AI SURVEILLANCE:
            {hasActiveAlert
              ? ` ${highPriorityCameras.length} ALERTS_ACTIVE`
              : ' SYSTEM_IDLE'}
          </div>

          {camerasToRender.length === 1 && hasActiveAlert && (
            <span
              className="
                text-[10px]
                text-gray-400
                font-mono
                uppercase
                truncate
                max-w-[180px]
                sm:max-w-[300px]
                md:max-w-none
              "
            >
              {camerasToRender[0]?.incidentId || 'CAM'} —{' '}
              {camerasToRender[0]?.location?.name || 'ZONE'}
            </span>
          )}
        </div>

        {hasActiveAlert && highPriorityCameras.length > 1 && (
          <button
            onClick={() =>
              setViewMode(viewMode === 'single' ? 'grid' : 'single')
            }
            className="
              px-2
              py-1
              text-[8px]
              bg-cyan-950/80
              hover:bg-cyan-900
              active:scale-95
              transition-all
              rounded
              border
              border-cyan-500/30
              text-cyan-400
              font-mono
              font-bold
              uppercase
              tracking-wider
              self-start
              sm:self-auto
            "
          >
            {viewMode === 'single' ? '➔ Show All Cameras' : '➔ Focus Mode'}
          </button>
        )}
      </div>

      {/* ================= VIEWPORT ================= */}
      <div className={`flex-1 min-h-0 overflow-hidden bg-black ${gridClass}`}>
        {hasActiveAlert ? (
          camerasToRender.map((incident) => {
            const lat = incident?.location?.coordinates?.[1] || 30.0444;

            const lng = incident?.location?.coordinates?.[0] || 31.2357;

            const currentStreamUrl =
              incident?.media?.liveFeedUrl ||
              'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';

            return (
              <div
                key={incident._id || incident.incidentId}
                className="
                  relative
                  w-full
                  h-full
                  min-h-[220px]
                  sm:min-h-[280px]
                  lg:min-h-[320px]
                  rounded-xl
                  overflow-hidden
                  border
                  border-red-500/10
                  bg-[#020608]
                  transition-all
                  duration-300
                "
              >
                {currentStreamUrl ? (
                  <LiveStream streamUrl={currentStreamUrl} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-600 text-[10px] font-mono">
                    NO_LIVE_STREAM_URL
                  </div>
                )}

                {/* HUD Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pointer-events-none">
                  {/* Top HUD */}
                  {/* Example:
                  <div className="w-max rounded border border-red-500/20 bg-black/70 px-2 py-1 text-[9px] font-mono font-bold text-red-400">
                    {incident?.type?.replace(/_/g, ' ')}
                  </div>
                  */}

                  {/* Bottom HUD */}
                  {/* Example:
                  <div className="flex flex-wrap gap-2 rounded-md border border-cyan-500/10 bg-black/80 p-2 text-[7px] font-mono text-cyan-500">
                    <span>CAM: {incident?.incidentId}</span>
                    <span>LOC: {incident?.location?.name}</span>
                    <span>
                      LAT: {lat.toFixed(4)} | LON: {lng.toFixed(4)}
                    </span>
                  </div>
                  */}
                </div>
              </div>
            );
          })
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full opacity-40 grayscale"
          >
            <source src="/assets/videos/city-live.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div
        className="
          p-2
          bg-black/80
          border-t
          border-cyan-500/10
          flex
          flex-col
          sm:flex-row
          justify-between
          gap-1
          text-[8px]
          font-mono
          text-cyan-700
        "
      >
        <span className="break-words">
          VIEW MODE: {viewMode.toUpperCase()} | PRIORITY LEVEL:{' '}
          {hasActiveAlert ? highestPriorityIncident?.priority : 'NONE'}
        </span>

        <span>
          {hasActiveAlert
            ? 'SOURCE: AI_PRIORITY_ROUTING'
            : 'STATUS: SCANNING...'}
        </span>
      </div>
    </div>
  );
};

export default CameraFeed;
