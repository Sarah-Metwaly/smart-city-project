import React, { useEffect, useState } from "react";
import { Flame, Thermometer, Wind, CloudRain, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
type SensorStatus = "critical" | "warning" | "normal";
type SensorType = "flame" | "temperature" | "mq135" | "smoke";

interface SensorReading {
  id: string;
  label: string;
  type: SensorType;
  value: number;
  unit: string;
  min: number;
  max: number;
  thresholds: { warning: number; critical: number };
  status: SensorStatus;
  history: number[];
  location: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const TYPE_ICON: Record<SensorType, React.ReactNode> = {
  flame:       <Flame size={18} />,
  temperature: <Thermometer size={18} />,
  mq135:       <Wind size={18} />,
  smoke:       <CloudRain size={18} />,
};

const STATUS_THEME: Record<SensorStatus, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: "#ff4433", bg: "rgba(255,68,51,0.10)",   border: "rgba(255,68,51,0.40)",   label: "CRITICAL" },
  warning:  { color: "#ffaa33", bg: "rgba(255,170,51,0.10)",  border: "rgba(255,170,51,0.35)",  label: "WARNING"  },
  normal:   { color: "#33dd88", bg: "rgba(51,221,136,0.08)",  border: "rgba(51,221,136,0.25)",  label: "NORMAL"   },
};

// ── Sparkline graph──────────────────────────────────────────────────────────────
function Sparkline({ data, color, max }: { data: number[]; color: string; max: number }) {
  if (data.length < 2) return null;
  const W = 120, H = 36;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${Math.min(Math.max(H - (v / max) * H, 1), H - 1)}`)
    .join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Radial Gauge circle ───────────────────────────────────────────────────────────
function RadialGauge({ value, max, color }: { value: number; max: number; color: string }) {
  const R = 22, C = 2 * Math.PI * R;
  const pct = Math.min(Math.max(value / max, 0), 1);
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={R} stroke="#1e1e20" strokeWidth="5" fill="none" />
      <circle
        cx="30" cy="30" r={R}
        stroke={color} strokeWidth="5" fill="none"
        strokeDasharray={`${pct * C} ${C}`}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <circle cx="30" cy="30" r="3" fill={color} opacity=".5" />
    </svg>
  );
}

// ── Sensor Card ────────────────────────────────────────────────────────────
function SensorCard({ sensor }: { sensor: SensorReading }) {
  const theme = STATUS_THEME[sensor.status]; //color depend in status 
  const isAlert = sensor.status !== "normal";
  const pct = Math.min(Math.max((sensor.value / sensor.max) * 100, 0), 100); //bar pct

  return (
    //animated Card
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background: `linear-gradient(135deg, #1E3A46 30%, ${theme.bg})`,
        border: `1px solid ${isAlert ? theme.border : "#27272a"}`,
      }}
    >
      {/* Alert pulse ring  (if there any alert display pulse border*/}
      {isAlert && (
        <motion.div
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${theme.color}` }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center p-2 rounded-lg"
            style={{ color: theme.color, background: theme.bg }}
          >
            {TYPE_ICON[sensor.type]}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#efeff1]">{sensor.label}</p>
            <p className="text-[10px] text-[#71717a]">{sensor.location}</p>
          </div>
        </div>

        {/* Status badge critical/warning/normal */}
        <span
          className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
          style={{ color: theme.color, border: `1px solid ${theme.color}33` }}
        >
          {theme.label}
        </span>
      </div>

      {/* Value + Gauge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">
              {sensor.value.toFixed(1)}
            </span>
            <span className="text-sm text-[#52525b]">{sensor.unit}</span>
          </div>
          <div className="mt-3">
            <Sparkline data={sensor.history} color={theme.color} max={sensor.max} />
          </div>
        </div>
        <RadialGauge value={sensor.value} max={sensor.max} color={theme.color} />
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#1e1e20] rounded-full mt-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: theme.color }}
        />
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SensorsOverview() {
  const [sensors, setSensors] = useState<SensorReading[]>([]);


  useEffect(() => {
    // ── Replace this block with your real API / WebSocket call ────────────
    // const ws = new WebSocket("ws://your-server/sensors");
    // ws.onmessage = (e) => {
    //   const data: SensorReading[] = JSON.parse(e.data);
    //   setSensors(data);
    // };
    // return () => ws.close();
    // ─────────────────────────────────────────────────────────────────────

    const initial: SensorReading[] = [
      {
        id: "S1", label: "Flame Sensor", type: "flame",
        value: 320, unit: "°C", min: 0, max: 500,
        thresholds: { warning: 200, critical: 400 },
        status: "warning", history: [280, 290, 310, 320], location: "Zone A",
      },
      {
        id: "S2", label: "Tempreture", type: "temperature",
        value: 12, unit: "%", min: 0, max: 100,
        thresholds: { warning: 40, critical: 80 },
        status: "normal", history: [5, 8, 12, 10], location: "Zone B",
      },
      
    ];
    setSensors(initial);

    const timer = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          const jitter = (Math.random() - 0.5) * 5;
          const newVal = Math.min(s.max, Math.max(s.min, s.value + jitter));
          const status: SensorStatus =
            newVal >= s.thresholds.critical ? "critical" :
            newVal >= s.thresholds.warning  ? "warning"  : "normal";
          return { ...s, value: newVal, status, history: [...s.history.slice(-19), newVal] };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className=" font-sans">

      {/* Header */}
      <header className="flex flex-col gap-1.5 justify-between mb-8">
        <div>
          <div className="flex justify-between gap-2.5">
            <h1 className="text-white text-xl font-semibold m-0">Sensors Overview</h1>
            <div className="flex items-center gap-1.5 bg-[#10b98115] border border-[#10b98133] px-2.5 py-1 rounded-full">
              <Wifi size={12} color="#10b981" />
              <span className="text-[#10b981] text-[10px] font-bold tracking-widest">LIVE</span>
            </div>
          </div>
          <p className="text-[#52525b] text-[13px] mt-1">
            Real-time sensor telemetry from Smart Grid
          </p>
        </div>

        
      </header>

      {/* Grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        <AnimatePresence>
          {sensors.map((s)=><SensorCard key={s.id} sensor={s}/>)}
        </AnimatePresence>
      </div>
    </div>
  );
}