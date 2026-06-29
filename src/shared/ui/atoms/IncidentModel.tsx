import { Link } from "react-router-dom";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

const SEV: Record<string, { bar: string; text: string; bgBorder: string }> = {
  HIGH:   { bar: "#ef4444", text: "text-red-400",     bgBorder: "bg-red-500/10 border-red-500/25" },
  MEDIUM: { bar: "#f59e0b", text: "text-amber-400",   bgBorder: "bg-amber-400/10 border-amber-400/25" },
  LOW:    { bar: "#34d399", text: "text-emerald-400", bgBorder: "bg-emerald-400/10 border-emerald-400/25" },
};

const RES: Record<string, { text: string; bgBorder: string; pulse?: boolean }> = {
  ACTIVE:     { text: "text-red-400",     bgBorder: "bg-red-500/10 border-red-500/25",        pulse: true },
  RESOLVED:   { text: "text-emerald-400", bgBorder: "bg-emerald-400/10 border-emerald-400/25" },
  DISPATCHED: { text: "text-amber-400",   bgBorder: "bg-amber-400/10 border-amber-400/25" },
};

const TYPE_ROUTES: Record<string, string> = {
  FIRE_DETECTION:   "/fire",
  SMOKE_DETECTION:  "/fire",
  POOR_AIR_QUALITY: "/fire",
  HIGH_HUMIDITY:    "/fire",
  LOW_PRESSURE:     "/fire",
  HIGH_PRESSURE:    "/fire",
  ENERGY_ANOMALY:   "/fire",
  HIGH_TEMPERATURE: "/fire",
  WEAPON_DETECTION:  "/police?tab=weapon",
  BEHAVIOR_ANOMALY:  "/police?tab=behavior",
  MEDICAL_EMERGENCY: "/police?tab=behavior",
  CROWD_MANAGEMENT:  "/police?tab=behavior",
  THEFT_DETECTION:   "/police?tab=behavior",
};

function Badge({ text, textClass, bgBorder, pulse }: { text: string; textClass: string; bgBorder: string; pulse?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md text-[9px] font-mono font-bold tracking-[0.18em] border ${textClass} ${bgBorder}`}>
      {pulse && (
        <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${textClass.replace("text-", "bg-")} opacity-50`} />
          <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${textClass.replace("text-", "bg-")}`} />
        </span>
      )}
      {text}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b" style={{ borderColor: "rgba(88,113,125,0.12)" }}>
      <span className="text-[10px] font-mono tracking-[0.18em] uppercase shrink-0" style={{ color: "rgba(88,113,125,0.6)" }}>
        {label}
      </span>
      <span className="text-[11px] font-mono text-right" style={{ color: "#B4C3CC" }}>
        {value}
      </span>
    </div>
  );
}

interface IncidentModalProps {
  incident: any;
  onClose: () => void;
}

export default function IncidentModal({ incident, onClose }: IncidentModalProps) {
  if (!incident) return null;

  const sev = SEV[incident.priority] ?? { bar: "#58717D", text: "text-[#58717D]", bgBorder: "bg-[#58717D]/10 border-[#58717D]/20" };
  const res = RES[incident.status?.toUpperCase()] ?? { text: "text-[#58717D]", bgBorder: "bg-[#58717D]/10 border-[#58717D]/20" };

  const imageUrl = incident.media?.images?.[0] ?? incident.aiData?.incident_image_url ?? null;

  const time = incident.createdAt
    ? new Date(incident.createdAt).toLocaleString("en-US", {
        hour12: false,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const route = TYPE_ROUTES[incident.type];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Modal - Max-w shrunk to max-w-sm */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)",
          boxShadow: "0 0 0 1px rgba(88,113,125,0.2), 0 40px 100px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent 0%,rgba(180,195,204,0.5) 35%,rgba(88,113,125,0.6) 65%,transparent 100%)" }}
        />

        {/* Severity bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: sev.bar }} />

        <div className="p-4 pl-6 space-y-3">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase" style={{ color: "rgba(88,113,125,0.6)" }}>
                Incident Report
              </span>
              <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: "#F4FEFE" }}>
                {incident.incidentId || incident.id}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-200 shrink-0 text-xs"
              style={{
                background: "rgba(88,113,125,0.1)",
                border: "1px solid rgba(88,113,125,0.2)",
                color: "#58717D",
              }}
            >
              ✕
            </button>
          </div>

          {/* Image - set to object-contain to show the full, uncropped image */}
{imageUrl && (
  <div 
    className="w-full h-48 rounded-xl overflow-hidden border flex items-center justify-center" 
    style={{ borderColor: "rgba(88,113,125,0.2)", background: "rgba(0,0,0,0.2)" }}
  >
    <img
      src={imageUrl}
      alt="incident"
      className="w-full h-full object-contain"
      onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
    />
  </div>
)}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge text={incident.priority} textClass={sev.text} bgBorder={sev.bgBorder} />
            <Badge text={incident.status} textClass={res.text} bgBorder={res.bgBorder} pulse={res.pulse} />
          </div>

          {/* Info rows */}
          <div className="space-y-0.5">
            <InfoRow label="Type" value={
              route ? (
                <Link to={route} className="hover:underline" style={{ color: "#14B8A6" }} onClick={onClose}>
                  {incident.type}
                </Link>
              ) : incident.type
            } />
            <InfoRow label="Location" value={incident.location?.name || "—"} />
            <InfoRow label="Source" value={incident.source?.type || "—"} />
            <InfoRow label="Device" value={incident.source?.deviceId || "—"} />
            <InfoRow label="Confidence" value={incident.aiData?.confidence != null ? `${(incident.aiData.confidence * 100).toFixed(0)}%` : "—"} />
            <InfoRow label="Danger Level" value={incident.aiData?.danger_level || "—"} />
            <InfoRow label="Coordinates" value={
              incident.location?.coordinates
                ? `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`
                : "—"
            } />
            <InfoRow label="Created At" value={time} />
          </div>
        </div>
      </div>
    </div>
  );
}