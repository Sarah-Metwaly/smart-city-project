import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useLiveIncidentStore } from '../../../store/useLiveIncidentStore';

interface LiveStreamProps {
  incidentId?: string;
  streamUrl?: string;
}

export default function LiveStream({ incidentId, streamUrl: overrideStreamUrl }: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const activeIncidents = useLiveIncidentStore((s) => s.activeIncidents);

  const incident = useMemo(() => {
    if (incidentId) {
      return activeIncidents.find((inc) => inc.incidentId === incidentId) ?? null;
    }
    return activeIncidents.find((inc) => inc.status === 'ACTIVE') ?? null;
  }, [activeIncidents, incidentId]);

  // Total count of incidents currently ACTIVE — shown in the header banner,
  const activeAlertsCount = useMemo(
    () => activeIncidents.filter((inc) => inc.status === 'ACTIVE').length,
    [activeIncidents]
  );

  // If a streamUrl is passed directly, use it; otherwise fall back to the
  // incident-derived URL from the live incident store.
  const streamUrl = overrideStreamUrl ?? incident?.media?.liveFeedUrl ?? '';
  const zone = incident?.location?.zone ?? incident?.location?.name ?? '—';
  const priorityLevel = incident?.priority ?? '—';
  const displayIncidentId = incident?.incidentId ?? '—';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) {
      setIsStreamActive(false);
      return;
    }

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 1,
        liveMaxLatencyDurationCount: 3,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
        setIsStreamActive(true);
      });

      hls.on(Hls.Events.ERROR, () => {
        setIsStreamActive(false);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;

      const handleMetadataLoaded = () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
        setIsStreamActive(true);
      };

      video.addEventListener('loadedmetadata', handleMetadataLoaded);

      return () => {
        video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      };
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <div className="overflow-hidden border rounded-xl border-red-500/40 bg-aman-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-red-500/30 bg-red-950/10">
        <div className="flex items-center gap-2 px-3 py-1 border rounded-md bg-red-500/10 border-red-500/40">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          <span className="text-red-500 text-[11px] font-bold uppercase tracking-wide">
            AI Surveillance: {activeAlertsCount} Alerts_Active
          </span>
        </div>

        <span className="text-aman-white/60 text-[12px] font-mono tracking-wide">
          {displayIncidentId} — {zone}
        </span>
      </div>

      {/* Video Area */}
      <div className="relative w-full h-[320px] overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="object-cover w-full h-full"
          muted
          controls={false}
          playsInline
        />

        {!isStreamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-aman-white/60">
            <span className="text-xs uppercase tracking-[2px] font-bold opacity-60">
              Waiting for stream...
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide z-20">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-white rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 bg-white rounded-full"></span>
          </span>
          Live
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-red-500/30 bg-red-950/10">
        <span className="text-aman-white/50 text-[10px] uppercase tracking-wide font-mono">
          View Mode: Single | Priority Level: {priorityLevel}
        </span>
        <span className="text-aman-white/50 text-[10px] uppercase tracking-wide font-mono">
          Source: AI_Priority_Routing
        </span>
      </div>
    </div>
  );
}