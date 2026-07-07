import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IncidentModal from "../../../shared/ui/atoms/IncidentModel";

// ─── Global keyframes ─────────────────────────────────────────────────────────
const STYLES = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .row-in { animation: rowIn 0.3s cubic-bezier(.22,1,.36,1) both; }
`;

// ─── Config maps ──────────────────────────────────────────────────────────────
const SEV: Record<string, { bar: string; text: string; bgBorder: string }> = {
  HIGH:   { bar: "#ef4444", text: "text-red-400",     bgBorder: "bg-red-500/10 border-red-500/25" },
  MEDIUM: { bar: "#f59e0b", text: "text-amber-400",   bgBorder: "bg-amber-400/10 border-amber-400/25" },
  LOW:    { bar: "#34d399", text: "text-emerald-400", bgBorder: "bg-emerald-400/10 border-emerald-400/25" },
};

const RES: Record<string, { text: string; bgBorder: string; pulse?: boolean }> = {
  ACTIVE:     { text: "text-red-400",     bgBorder: "bg-red-500/10 border-red-500/25",       pulse: true },
  RESOLVED:   { text: "text-emerald-400", bgBorder: "bg-emerald-400/10 border-emerald-400/25" },
  DISPATCHED: { text: "text-amber-400",   bgBorder: "bg-amber-400/10 border-amber-400/25" },
};

const TYPE_ROUTES: Record<string, string> = {
  FIRE_DETECTION:   "/fire",
  FLAME_DETECTION:  "/fire",
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

// ─── Filter select ────────────────────────────────────────────────────────────
function Filter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[11px] font-mono rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer appearance-none w-full sm:w-auto"
      style={{
        background: "rgba(10,14,20,0.75)",
        border: "1px solid rgba(88,113,125,0.25)",
        color: "#B4C3CC",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2358717D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        paddingRight: "26px",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({
  text,
  textClass,
  bgBorder,
  pulse,
}: {
  text: string;
  textClass: string;
  bgBorder: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md text-[9px] font-mono font-bold tracking-[0.18em] border ${textClass} ${bgBorder}`}
    >
      {pulse && (
        <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${textClass.replace("text-", "bg-")} opacity-50`}
          />
          <span
            className={`relative inline-flex rounded-full w-1.5 h-1.5 ${textClass.replace("text-", "bg-")}`}
          />
        </span>
      )}
      {text}
    </span>
  );
}

// ─── Image cell ───────────────────────────────────────────────────────────────
function IncidentImage({ src }: { src: string | null | undefined }) {
  if (!src) {
    return (
      <span className="text-[11px] font-mono" style={{ color: "rgba(180,195,204,0.5)" }}>
        No image
      </span>
    );
  }
  return (
    <img
      src={src}
      alt="incident"
      className="w-10 h-10 rounded-lg object-cover border"
      style={{ borderColor: "rgba(88,113,125,0.25)" }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

// ─── Type cell ────────────────────────────────────────────────────────────────
function IncidentType({ type, hovered }: { type: string; hovered?: boolean }) {
  const route = TYPE_ROUTES[type];
  const style = { color: hovered ? "#F4FEFE" : "rgba(180,195,204,0.75)" };

  if (route) {
    return (
      <Link
        to={route}
        className="text-xs hover:underline transition-colors duration-200"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {type}
      </Link>
    );
  }
  return (
    <span className="text-xs" style={style}>
      {type}
    </span>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function MobileCard({
  incident,
  idx,
  onClick,
}: {
  incident: any;
  idx: number;
  onClick: () => void;
}) {
  const sev = SEV[incident.priority] ?? {
    bar: "#58717D",
    text: "text-[#58717D]",
    bgBorder: "bg-[#58717D]/10 border-[#58717D]/20",
  };
  const res = RES[incident.status?.toUpperCase()] ?? {
    text: "text-[#58717D]",
    bgBorder: "bg-[#58717D]/10 border-[#58717D]/20",
  };

  const time = incident.createdAt
    ? new Date(incident.createdAt).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const imageUrl = incident.media?.images?.[0] ?? incident.aiData?.incident_image_url ?? null;

  return (
    <div
      className="row-in relative rounded-xl p-4 space-y-3 cursor-pointer"
      style={{
        animationDelay: `${idx * 35}ms`,
        background: idx % 2 === 0 ? "transparent" : "rgba(10,14,20,0.25)",
        border: "1px solid rgba(88,113,125,0.1)",
        borderLeft: `3px solid ${sev.bar}`,
      }}
      onClick={onClick}
    >
      {/* Top row: ID + time */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-widest text-[#58717D]">
          {incident.incidentId || incident.id}
        </span>
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "rgba(180,195,204,0.45)" }}>
          {time}
        </span>
      </div>

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="incident"
          className="w-full h-28 rounded-lg object-cover border"
          style={{ borderColor: "rgba(88,113,125,0.25)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}

      {/* Location + type */}
      <div className="space-y-1">
        <p className="text-xs text-[#F4FEFE] truncate">
          {incident.location?.name || "Unknown"}
        </p>
        <IncidentType type={incident.type} />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge text={incident.priority} textClass={sev.text} bgBorder={sev.bgBorder} />
        <Badge text={incident.status} textClass={res.text} bgBorder={res.bgBorder} pulse={res.pulse} />
      </div>
    </div>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────
function TableRow({
  incident,
  idx,
  onClick,
}: {
  incident: any;
  idx: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const sev = SEV[incident.priority] ?? {
    bar: "#58717D",
    text: "text-[#58717D]",
    bgBorder: "bg-[#58717D]/10 border-[#58717D]/20",
  };
  const res = RES[incident.status?.toUpperCase()] ?? {
    text: "text-[#58717D]",
    bgBorder: "bg-[#58717D]/10 border-[#58717D]/20",
  };

  const time = incident.createdAt
    ? new Date(incident.createdAt).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const imageUrl = incident.media?.images?.[0] ?? incident.aiData?.incident_image_url ?? null;

  return (
    <tr
      className="row-in border-b transition-colors duration-200 cursor-pointer"
      style={{
        animationDelay: `${idx * 35}ms`,
        borderColor: "rgba(88,113,125,0.1)",
        background: hovered
          ? "rgba(88,113,125,0.08)"
          : idx % 2 === 0
          ? "transparent"
          : "rgba(10,14,20,0.25)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* ID */}
      <td className="py-3.5 px-4 relative">
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r transition-all duration-300"
          style={{
            background: sev.bar,
            opacity: hovered ? 0.9 : 0,
            transform: hovered ? "scaleY(1)" : "scaleY(0.3)",
          }}
        />
        <span
          className="font-mono text-[11px] tracking-widest transition-colors duration-200"
          style={{ color: hovered ? "#F4FEFE" : "#58717D" }}
        >
          {incident.incidentId || incident.id}
        </span>
      </td>

      {/* Time */}
      <td className="py-3.5 px-4 hidden lg:table-cell">
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "rgba(180,195,204,0.45)" }}>
          {time}
        </span>
      </td>

      {/* Location */}
      <td className="py-3.5 px-4 max-w-[130px] xl:max-w-[160px]">
        <span
          className="text-xs truncate block transition-colors duration-200"
          style={{ color: hovered ? "#F4FEFE" : "#B4C3CC" }}
        >
          {incident.location?.name || "Unknown"}
        </span>
      </td>

      {/* Type */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div
            className="h-3 rounded-full flex-shrink-0 transition-all duration-300"
            style={{
              background: hovered ? sev.bar : "rgba(88,113,125,0.35)",
              width: hovered ? "2px" : "1px",
            }}
          />
          <IncidentType type={incident.type} hovered={hovered} />
        </div>
      </td>

      {/* Severity */}
      <td className="py-3.5 px-4">
        <Badge text={incident.priority} textClass={sev.text} bgBorder={sev.bgBorder} />
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <Badge text={incident.status} textClass={res.text} bgBorder={res.bgBorder} pulse={res.pulse} />
      </td>

      {/* Image */}
      <td className="py-3.5 px-4">
        <IncidentImage src={imageUrl} />
      </td>
    </tr>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ idx }: { idx: number }) {
  const widths = ["w-20", "w-14", "w-28", "w-20", "w-12", "w-14", "w-10"];
  return (
    <tr
      className="border-b"
      style={{
        borderColor: "rgba(88,113,125,0.1)",
        background: idx % 2 === 0 ? "transparent" : "rgba(10,14,20,0.25)",
      }}
    >
      {widths.map((w, i) => (
        <td key={i} className="py-4 px-4">
          <div
            className={`h-2.5 rounded-full ${w}`}
            style={{
              background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.6s ease-in-out ${idx * 80 + i * 35}ms infinite`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

function MobileSkeleton({ idx }: { idx: number }) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        border: "1px solid rgba(88,113,125,0.1)",
        borderLeft: "3px solid rgba(88,113,125,0.2)",
        background: idx % 2 === 0 ? "transparent" : "rgba(10,14,20,0.25)",
      }}
    >
      <div className="flex justify-between">
        <div className="h-2.5 w-20 rounded-full" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80}ms infinite` }} />
        <div className="h-2.5 w-14 rounded-full" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80 + 50}ms infinite` }} />
      </div>
      <div className="h-20 w-full rounded-lg" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80 + 75}ms infinite` }} />
      <div className="h-2.5 w-36 rounded-full" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80 + 100}ms infinite` }} />
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-md" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80 + 150}ms infinite` }} />
        <div className="h-5 w-16 rounded-md" style={{ background: "linear-gradient(90deg,#1E3A46 25%,#2a4f60 50%,#1E3A46 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.6s ease-in-out ${idx * 80 + 200}ms infinite` }} />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{
              background: "rgba(88,113,125,0.08)",
              border: "1px solid rgba(88,113,125,0.18)",
              color: "rgba(88,113,125,0.6)",
            }}
          >
            —
          </div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "rgba(88,113,125,0.4)" }}>
            No incidents found
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface IncidentTableProps {
  incidents?: any[];
  isLoading: boolean;
  isError: boolean;
  title?: string;
  icon?: React.ReactNode;
}

export default function IncidentTable({
  incidents,
  isLoading,
  isError,
  title,
  icon,
}: IncidentTableProps) {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sevFilter, setSevFilter] = useState("ALL");
  const [resFilter, setResFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const uniqueTypes = incidents
    ? ["ALL", ...Array.from(new Set(incidents.map((i) => i.type).filter(Boolean)))]
    : ["ALL"];

  const filtered = incidents?.filter(
    (i) =>
      (typeFilter === "ALL" || i.type === typeFilter) &&
      (sevFilter === "ALL" || i.priority === sevFilter) &&
      (resFilter === "ALL" || i.status?.toUpperCase() === resFilter)
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Modal ── */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-[600ms]"
        style={{
          background: "linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)",
          boxShadow: "0 0 0 1px rgba(88,113,125,0.2), 0 40px 100px rgba(0,0,0,0.6)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Scanline texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(88,113,125,0.018) 3px,rgba(88,113,125,0.018) 4px)",
          }}
        />

        {/* Top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg,transparent 0%,rgba(180,195,204,0.5) 35%,rgba(88,113,125,0.6) 65%,transparent 100%)",
          }}
        />

        <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-5">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(10,14,20,0.7)", border: "1px solid rgba(88,113,125,0.2)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: "blink 1.3s ease-in-out infinite" }} />
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#58717D] uppercase select-none">Live</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {icon && <span className="text-[#58717D]/60">{icon}</span>}
                <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: "#F4FEFE" }}>
                  {title}
                </h2>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Filter value={typeFilter} options={uniqueTypes} onChange={setTypeFilter} />
              <Filter value={sevFilter} options={["ALL", "HIGH", "MEDIUM", "LOW"]} onChange={setSevFilter} />
              <Filter value={resFilter} options={["ALL", "ACTIVE", "RESOLVED", "DISPATCHED"]} onChange={setResFilter} />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px" style={{ background: "linear-gradient(90deg,rgba(88,113,125,0.35),rgba(88,113,125,0.08),transparent)" }} />

          {/* ── Mobile card list ── */}
          <div className="flex flex-col gap-2 sm:hidden">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <MobileSkeleton key={i} idx={i} />)
            ) : isError ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>!</div>
                <span className="text-[10px] font-mono tracking-[0.22em] text-red-400/60 uppercase">Error loading data</span>
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "rgba(88,113,125,0.08)", border: "1px solid rgba(88,113,125,0.18)", color: "rgba(88,113,125,0.6)" }}>—</div>
                <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "rgba(88,113,125,0.4)" }}>No incidents found</span>
              </div>
            ) : (
              filtered.map((incident, idx) => (
                <MobileCard
                  key={incident._id}
                  incident={incident}
                  idx={idx}
                  onClick={() => setSelectedIncident(incident)}
                />
              ))
            )}
          </div>

          {/* ── Table (sm+) ── */}
          <div
            className="hidden sm:block overflow-x-auto max-h-[350px] overflow-y-auto rounded-xl"
            style={{
              border: "1px solid rgba(88,113,125,0.15)",
              boxShadow: "inset 0 1px 0 rgba(180,195,204,0.04), inset 0 -1px 0 rgba(0,0,0,0.3)",
            }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(88,113,125,0.15)", background: "rgba(10,14,20,0.5)" }}>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none" style={{ color: "rgba(88,113,125,0.5)" }}>Event ID</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none hidden lg:table-cell" style={{ color: "rgba(88,113,125,0.5)" }}>Time</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none" style={{ color: "rgba(88,113,125,0.5)" }}>Location</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none hidden md:table-cell" style={{ color: "rgba(88,113,125,0.5)" }}>Type</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none" style={{ color: "rgba(88,113,125,0.5)" }}>Severity</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none" style={{ color: "rgba(88,113,125,0.5)" }}>Status</th>
                  <th className="py-3 px-4 text-[9px] font-mono tracking-[0.22em] uppercase select-none" style={{ color: "rgba(88,113,125,0.5)" }}>Image</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} idx={i} />)
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>!</div>
                        <span className="text-[10px] font-mono tracking-[0.22em] text-red-400/60 uppercase">Error loading data</span>
                      </div>
                    </td>
                  </tr>
                ) : !filtered || filtered.length === 0 ? (
                  <EmptyState colSpan={7} />
                ) : (
                  filtered.map((incident, idx) => (
                    <TableRow
                      key={incident._id}
                      incident={incident}
                      idx={idx}
                      onClick={() => setSelectedIncident(incident)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          {!isLoading && filtered && filtered.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(88,113,125,0.35)" }}>Synced</span>
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}