import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, MapPin, Clock, ChevronRight } from "lucide-react";
import {type  FireAlert, SEVERITY_THEME } from "../../../types/fireAlert.types";


interface AlertItemProps {
  alert: FireAlert;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, isOpen, onToggle }) => {
  const theme = SEVERITY_THEME[alert.severity];
  const [acknowledged, setAcknowledged] = useState(false);

  const confidenceDesc =
    alert.severity === "high"
      ? "Very high certainty — immediate action required"
      : alert.severity === "medium"
      ? "Moderate certainty — verify with on-site unit"
      : "Low certainty — monitor closely";

  return (
    <div
      className="border-b border-white/[0.04]"
      style={{
        borderLeft: `2px solid ${isOpen ? theme.color : "transparent"}`,
        background: isOpen ? theme.bg : "transparent",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {/* ── Clickable row ── */}
      <button
        onClick={() => onToggle(alert.id)}
        className="w-full text-left flex items-start gap-3 px-4 py-3 cursor-pointer border-none outline-none bg-transparent transition-colors"
        style={{ fontFamily: "inherit" }}
        onMouseEnter={(e) =>
          !isOpen &&
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(255,255,255,0.02)")
        }
        onMouseLeave={(e) =>
          !isOpen &&
          ((e.currentTarget as HTMLElement).style.background = "transparent")
        }
      >
        {/* Flame icon */}
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mt-0.5"
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            color: theme.color,
          }}
        >
          <Flame size={13} />
        </div>

        {/* Text body */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          {/**incident Type */}
          <span
              className="text-[11px] font-semibold truncate text-aman-white"
            >
              {alert.type}
            </span>
          {/* Location + severity badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[10px] font-semibold truncate text-aman-light"
            >
              {alert.location}
            </span>
            <span
              className="text-[8px] font-extrabold tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                color: theme.color,
              }}
            >
              {theme.label}
            </span>
          </div>

          
          {/* Time + confidence value */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px]" style={{ color: "#2e7a8f" }}>
              {alert.detectedAt}
            </span>
            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: theme.color }}
            >
              {alert.confidence}%
            </span>
          </div>


          
        </div>
      </button>

      {/* ── Inline expanded detail card ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-3 pb-3">
              <div
                className="relative rounded-xl px-4 py-3 flex flex-col gap-2.5 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, #0c1922 30%, ${theme.bg})`,
                  border: `1px solid ${theme.border}`,
                  boxShadow: `0 0 20px ${theme.glow}`,
                }}
              >
                {/* Pulse border ring */}
                {!acknowledged && (
                  <motion.div
                    animate={{ opacity: [0.12, 0.42, 0.12] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1px solid ${theme.color}` }}
                  />
                )}

                {/* AI Confidence */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] font-medium tracking-widest text-aman-light"
                      
                    >
                      AI CONFIDENCE
                    </span>
                    <span
                      className="text-[13px] font-bold tabular-nums"
                      style={{ color: theme.color }}
                    >
                      {alert.confidence}%
                    </span>
                  </div>

                  {/* Confidence track */}
                  <div
                    className="relative h-1 rounded-full overflow-hidden"
                    style={{ background: "#111c22" }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${alert.confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        background: `linear-gradient(90deg, ${theme.color}55, ${theme.color})`,
                      }}
                    />
                    {/* Shimmer */}
                    <motion.div
                      className="absolute top-0 h-full w-9 rounded-full"
                      animate={{ left: ["-15%", "115%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.4,
                        ease: "easeInOut",
                        repeatDelay: 0.8,
                      }}
                      style={{
                        background: `linear-gradient(90deg, transparent, ${theme.color}44, transparent)`,
                      }}
                    />
                  </div>

                  <p className="text-[9px] text-aman-light" >
                    {confidenceDesc}
                  </p>
                </div>

                {/* Footer — time + acknowledge */}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: "1px solid #111c22" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} style={{ color: "#2e7a8f" }} />
                    <span className="text-[9px]" style={{ color: "#2e7a8f" }}>
                      Detected {alert.detectedAt}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcknowledged((v) => !v);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all duration-200"
                    style={{
                      fontFamily: "inherit",
                      background: acknowledged
                        ? "rgba(51,221,136,0.12)"
                        : theme.bg,
                      color: acknowledged ? "#33dd88" : theme.color,
                      border: `1px solid ${
                        acknowledged
                          ? "rgba(51,221,136,0.3)"
                          : theme.border
                      }`,
                    }}
                  >
                    {acknowledged ? (
                      "Acknowledged ✓"
                    ) : (
                      <>
                        Acknowledge
                        <ChevronRight size={9} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertItem;