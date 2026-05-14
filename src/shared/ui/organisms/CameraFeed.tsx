
import React from "react";
import { useLiveIncidentStore } from "../../../store/useLiveIncidentStore";

const CameraFeed: React.FC = () => {
  const { latestIncident, isAlertActive, dismissAlert } = useLiveIncidentStore();

  const lat = latestIncident?.location?.coordinates?.[1] || 30.0444;
  const lng = latestIncident?.location?.coordinates?.[0] || 31.2357;

  // fallback: لو الصورة مش موجودة في media.images، نجيبها من aiData.incident_image_url
const incidentImage =
  latestIncident?.media?.images?.[0] ||
  latestIncident?.aiData?.incident_image_url ||
  null;


  return (
    <div
      className={`flex flex-col w-full h-auto aspect-21/9 max-h-87.5 bg-[#050c10] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 
      ${isAlertActive ? "border-red-500 shadow-red-500/20" : "border-cyan-500/30"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-3 border-b bg-black/60 ${
          isAlertActive ? "border-red-500/20" : "border-cyan-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-2 py-0.5 border rounded text-[9px] font-bold 
            ${
              isAlertActive
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAlertActive ? "bg-red-500 animate-ping" : "bg-cyan-500 animate-pulse"
              }`}
            ></span>
            AI FEED: {isAlertActive ? "ALERT_DETECTED" : "SYSTEM_IDLE"}
          </div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            {latestIncident?.incidentId || "CAM-007"} —{" "}
            {latestIncident?.location?.name || "EAST SIDE"}
          </span>
        </div>
        {isAlertActive && (
          <button
            onClick={dismissAlert}
            className="px-2 py-1 text-[8px] bg-red-600 border border-red-500 rounded text-white font-bold uppercase tracking-tighter"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Viewport */}
      <div className="relative flex items-center justify-center flex-1 overflow-hidden bg-black">
        {isAlertActive && incidentImage ? (
          <img
            src={incidentImage}
            alt="Incident"
            className="object-cover w-full h-full duration-700 animate-in fade-in"
            onError={() => console.error("❌ Image failed to load:", incidentImage)}
          />
        ) : (
          <video autoPlay muted loop className="object-cover w-full h-full opacity-40 grayscale">
            <source src="/assets/videos/city-live.mp4" type="video/mp4" />
          </video>
        )}

        {/* HUD Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className={`absolute w-6 h-6 border-t-2 border-l-2 top-3 left-3 ${
              isAlertActive ? "border-red-500" : "border-cyan-500/30"
            }`}
          ></div>
          <div
            className={`absolute w-6 h-6 border-b-2 border-r-2 bottom-3 right-3 ${
              isAlertActive ? "border-red-500" : "border-cyan-500/30"
            }`}
          ></div>

          {isAlertActive && (
            <div className="absolute p-4 text-center text-red-500 -translate-x-1/2 -translate-y-1/2 border border-red-500 top-1/2 left-1/2 bg-black/60 backdrop-blur-md">
              <p className="text-[10px] font-mono font-bold tracking-widest uppercase">
                {latestIncident?.type?.replace("_", " ")}
              </p>
              <p className="text-[8px] opacity-70">PRIORITY: {latestIncident?.priority}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-black/80 border-t border-cyan-500/10 flex justify-between items-center text-[8px] font-mono text-cyan-800">
        <div className="flex gap-4">
          <span>LAT: {lat.toFixed(4)}</span>
          <span>LON: {lng.toFixed(4)}</span>
        </div>
        <span>{isAlertActive ? "SOURCE: AI_ANALYSIS_ACTIVE" : "STATUS: SCANNING..."}</span>
      </div>
    </div>
  );
};

export default CameraFeed;
