import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Flame } from "lucide-react";
import { type FireAlert, SEVERITY_THEME, type Severity } from "../../../types/fireAlert.types"
import AlertItem from "../atoms/AlertItem";

interface ActiveAlertsSidebarProps {
  alerts: FireAlert[];
  title?: string;
}

const ActiveAlertsSidebar: React.FC<ActiveAlertsSidebarProps> = ({
  alerts,
  title = "Active Fire Alerts",
}) => {
  // Tracks which alert row is expanded — null means all collapsed
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const counts: Record<Severity, number> = {
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  };

  return (
    <div
      className="flex flex-col h-[400px] font-mono bg-aman-teal"
      style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <div
        className="px-4 pt-4 pb-3 flex flex-col  gap-2.5 bg-aman-dark"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Title row */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{ background: "rgba(255,68,51,0.12)", border: "1px solid rgba(255,68,51,0.25)" }}
          >
            <ShieldAlert size={13} color="#ff4433" />
          </div>
          <h3
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#e0e0e0" }}
          >
            {title}
          </h3>
        </div>

        {/* Severity summary pills */}
        <div className="flex gap-1.5  flex-wrap">
          {(["high", "medium", "low"] as Severity[]).map((s) => {
            const t = SEVERITY_THEME[s];
            return counts[s] > 0 ? (
              <div
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-widest"
                style={{
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  color: t.color,
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: t.color }}
                />
                {counts[s]} {s.toUpperCase()}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* ── Alert list ── */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Flame size={24} style={{ color: "#1e2e38" }} />
              <p
                className="text-[9px] tracking-widest uppercase"
                style={{ color: "#243038" }}
              >
                No Active Incidents
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
              >
                <AlertItem
                  alert={alert}
                  isOpen={openId === alert.id}
                  onToggle={handleToggle}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-2.5 text-center bg-aman-dark "
        style={{  borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="text-[9px] tracking-widest uppercase text-aman-light"
         
        >
          {alerts.length} incident{alerts.length !== 1 ? "s" : ""} monitored
        </p>
      </div>
    </div>
  );
};

export default ActiveAlertsSidebar;