import React, { useEffect, useState } from "react";
import { Flame, MapPin, Clock, Camera, ChevronRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
type Severity = "high" | "medium" | "low";

interface FireAlert {
  id: string;
  location: string;
  zone: string;
  camera: string;
  severity: Severity;
  confidence: number; // 0–100
  detectedAt: string;
  status: "active" | "acknowledged";
}

// ── Constants ──────────────────────────────────────────────────────────────
const SEVERITY_THEME: Record<Severity, { color: string; bg: string; border: string; label: string; glow: string }> = {
  high:   { color: "#ff4433", bg: "rgba(255,68,51,0.10)",   border: "rgba(255,68,51,0.35)",   label: "HIGH",   glow: "rgba(255,68,51,0.15)"   },
  medium: { color: "#ffaa33", bg: "rgba(255,170,51,0.10)",  border: "rgba(255,170,51,0.30)",  label: "MEDIUM", glow: "rgba(255,170,51,0.12)"  },
  low:    { color: "#ffdd44", bg: "rgba(255,221,68,0.08)",  border: "rgba(255,221,68,0.25)",  label: "LOW",    glow: "rgba(255,221,68,0.10)"  },
};

// ── Alert Card ─────────────────────────────────────────────────────────────
function AlertCard({ alert }: { alert: FireAlert }) {
  const theme = SEVERITY_THEME[alert.severity];
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl px-3 py-1 flex flex-col gap-1"
      style={{
        background: `linear-gradient(135deg, #1E3A46 40%, ${theme.bg})`,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 0 24px ${theme.glow}`,
      }}
    >
      {/* Pulse ring */}
      {!acknowledged && (
        <motion.div
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${theme.color}` }}
        />
      )}

      {/* Top row — severity + camera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Flame icon */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color }}
          >
            <Flame size={18} />
          </div>

          {/* Severity badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
          >
            {!acknowledged && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: theme.color }}
              />
            )}
            <span
              className="text-[10px] font-extrabold tracking-widest"
              style={{ color: theme.color }}
            >
              {theme.label}
            </span>
          </div>
        </div>

        {/* Camera badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aman-light border border-[#2a2a2a]">
          <Camera size={11} className="text-[#555]" />
          <span className="text-[10px] text-[#555] font-medium">{alert.camera}</span>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-[15px] font-semibold text-white leading-tight">{alert.location}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="text-[#444]" />
          <span className="text-[11px] text-[#444]">{alert.zone}</span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#555] font-medium tracking-wide">AI Confidence</span>
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: theme.color }}
          >
            {alert.confidence}%
          </span>
        </div>

        {/* Track */}
        <div className="relative h-2 rounded-full overflow-hidden bg-[#1e1e20]">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${alert.confidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              background: `linear-gradient(90deg, ${theme.color}88, ${theme.color})`,
            }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute top-0 h-full w-12 rounded-full"
            animate={{ left: ["-20%", "120%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.color}55, transparent)`,
            }}
          />
        </div>

        {/* Confidence label */}
        <p className="text-[10px]" style={{ color: "#333" }}>
          {alert.confidence >= 85
            ? "Very high certainty — immediate action required"
            : alert.confidence >= 65
            ? "Moderate certainty — verify with on-site unit"
            : "Low certainty — monitor closely"}
        </p>
      </div>

      {/* Footer — time + acknowledge */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-[#444]" />
          <span className="text-[10px] text-[#444]">Detected {alert.detectedAt}</span>
        </div>

        <button
          onClick={() => setAcknowledged((v) => !v)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer border-none"
          style={{
            background: acknowledged ? "rgba(51,221,136,0.12)" : theme.bg,
            color: acknowledged ? "#33dd88" : theme.color,
            border: `1px solid ${acknowledged ? "rgba(51,221,136,0.3)" : theme.border}`,
          }}
        >
          {acknowledged ? "Acknowledged ✓" : "Acknowledge"}
          {!acknowledged && <ChevronRight size={11} />}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
const MOCK_ALERTS: FireAlert[] = [
  {
    id: "A1", location: "Industrial Block 7", zone: "Zone B — Industrial District",
    camera: "CAM-04", severity: "high", confidence: 94,
    detectedAt: "14:35:08", status: "active",
  },
  {
    id: "A2", location: "Park North Entrance", zone: "Zone D — Park Area",
    camera: "CAM-03", severity: "medium", confidence: 72,
    detectedAt: "13:12:45", status: "active",
  },
  {
    id: "A3", location: "Warehouse Storage", zone: "Zone C — Residential",
    camera: "CAM-07", severity: "low", confidence: 51,
    detectedAt: "12:58:30", status: "active",
  },
];

export default function FireAlerts() {
  const [alerts, setAlerts] = useState<FireAlert[]>([]);

  useEffect(() => {
    // ── Replace with real WebSocket / API ──────────────────────────────
    // const ws = new WebSocket("ws://your-server/alerts");
    // ws.onmessage = (e) => setAlerts(JSON.parse(e.data));
    // return () => ws.close();
    // ──────────────────────────────────────────────────────────────────
    setAlerts(MOCK_ALERTS);``
  }, []);

  const counts = {
    high:   alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low:    alerts.filter((a) => a.severity === "low").length,
  };

  return (
    <div className="bg-aman-dark p-6 rounded-2xl flex flex-col  gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ff443318] border border-[#ff443333]">
            <ShieldAlert size={16} color="#ff4433" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-white leading-none">Active Fire Alerts</h2>
            <p className="text-[11px] text-[#444] mt-0.5">AI Camera Detection</p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2">
          {(["high", "medium", "low"] as Severity[]).map((s) => {
            const t = SEVERITY_THEME[s];
            return counts[s] > 0 ? (
              <div
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest"
                style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: t.color }}
                />
                {counts[s]} {s.toUpperCase()}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Flame size={28} className="text-[#2a2a2a]" />
              <p className="text-[#333] text-sm">No active alerts</p>
            </div>
          ) : (
            alerts.map((a) => <AlertCard key={a.id} alert={a} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}