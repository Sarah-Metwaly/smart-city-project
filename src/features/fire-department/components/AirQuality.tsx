// components/fire/AirQuality.tsx
import React from "react";
import { Wifi, AlertTriangle } from "lucide-react";
import { useAirQuality } from "../hooks/useAirQuality";


// ── Types ──────────────────────────────────────────────────────────────────
type AQStatus = "normal" | "warning" | "danger" | "stable";
type GasLevel = "High" | "Moderate" | "Normal";

// ── Helpers ────────────────────────────────────────────────────────────────
function getMQ135Status(v: number): AQStatus {
  if (v >= 7) return "danger";
  if (v >= 4) return "warning";
  return "normal";
}

function gethumidityStatus (v:number): AQStatus {
    if (v < 980 || v > 1040) return "warning";
  return "normal";
}

function getPressureStatus(v: number): AQStatus {
  if (v < 980 || v > 1040) return "warning";
  return "normal";
}

function getAQIInfo(v: number): { label: string; color: string } {
  if (v <= 50)  return { label: "Good",      color: "#2EC4A9" };
  if (v <= 100) return { label: "Moderate",  color: "#F4E623" };
  if (v <= 150) return { label: "Unhealthy", color: "#F4A623" };
  return              { label: "Hazardous",  color: "#E63946" };
}

function getAQIMarkerLeft(v: number): string {
  return `${Math.min((v / 200) * 100, 100)}%`;
}

function getCoLevel(v: number): GasLevel {
  if (v >= 7) return "High";
  if (v >= 4) return "Moderate";
  return "Normal";
}

function getCo2Level(v: number): GasLevel {
  if (v >= 1500) return "High";
  if (v >= 1000) return "Moderate";
  return "Normal";
}

// ── Style maps ─────────────────────────────────────────────────────────────
const statusStyles: Record<AQStatus, {
  value: string; badge: string; iconWrap: string; cardBorder: string; bar: string;
}> = {
  danger: {
    value:      "text-[#E63946]",
    badge:      "bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/25",
    iconWrap:   "bg-[#E63946]/10 border border-[#E63946]/20",
    cardBorder: "border-[#E63946]/30",
    bar:        "from-[#E63946]/40 to-[#E63946]",
  },
  warning: {
    value:      "text-[#F4A623]",
    badge:      "bg-[#F4A623]/10 text-[#F4A623] border border-[#F4A623]/25",
    iconWrap:   "bg-[#F4A623]/10 border border-[#F4A623]/20",
    cardBorder: "border-[#F4A623]/30",
    bar:        "from-[#F4A623]/40 to-[#F4A623]",
  },
  normal: {
    value:      "text-[#2EC4A9]",
    badge:      "bg-[#2EC4A9]/10 text-[#2EC4A9] border border-[#2EC4A9]/20",
    iconWrap:   "bg-[#2EC4A9]/10 border border-[#2EC4A9]/20",
    cardBorder: "border-[#2EC4A9]/25",
    bar:        "from-[#2EC4A9]/40 to-[#2EC4A9]",
  },
  stable: {
    value:      "text-[#B4C3CC]",
    badge:      "bg-[#58717D]/15 text-[#B4C3CC] border border-[#58717D]/30",
    iconWrap:   "bg-[#58717D]/15 border border-[#58717D]/20",
    cardBorder: "border-[#58717D]/30",
    bar:        "from-[#58717D]/40 to-[#B4C3CC]",
  },
};

const statusLabel: Record<AQStatus, string> = {
  danger: "CRITICAL", warning: "WARNING", normal: "NORMAL", stable: "STABLE",
};

const gasColor: Record<GasLevel, string> = {
  High:     "text-[#E63946]",
  Moderate: "text-[#F4A623]",
  Normal:   "text-[#2EC4A9]",
};

const gasFill: Record<GasLevel, string> = {
  High:     "bg-[#E63946]",
  Moderate: "bg-[#F4A623]",
  Normal:   "bg-[#2EC4A9]",
};

const gasBarWidth: Record<GasLevel, string> = {
  High: "w-[88%]", Moderate: "w-[50%]", Normal: "w-[15%]",
};

// ── Sub-components ─────────────────────────────────────────────────────────
function MQ135Icon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PressureIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AltitudeIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 20h16L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 8v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SensorCard({
  label, sub, value, unit, pct, status, icon,
}: {
  label: string; sub: string; value: number;
  unit: string; pct: number; status: AQStatus;
  icon: React.ReactNode;
}) {
  const s = statusStyles[status];
  return (
    <div className={`bg-aman-dark rounded-xl p-4 flex flex-col gap-3 border ${s.cardBorder}`}>
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.iconWrap}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest ${s.badge}`}>
          {statusLabel[status]}
        </span>
      </div>
      <div>
        <p className="text-[11px] font-medium text-[#B4C3CC]">{label}</p>
        <p className="text-[9px] text-[#58717D]">{sub}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-semibold leading-none tabular-nums ${s.value}`}>
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
        <span className="text-xs text-[#58717D]">{unit}</span>
      </div>
      <div className="bg-[#1E3A46] rounded-full h-1 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${s.bar}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function GasItem({ name, value, level }: { name: string; value: string; level: GasLevel }) {
  return (
    <div className="bg-aman-teal rounded-lg p-3">
      <p className="text-[10px] text-[#58717D] mb-1.5">{name}</p>
      <p className={`text-[15px] font-semibold mb-1.5 ${gasColor[level]}`}>{value}</p>
      <div className="bg-[#182B31] h-[3px] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${gasFill[level]} ${gasBarWidth[level]}`} />
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#1E3A46] rounded-lg ${className}`} />;
}

function AirQualitySkeleton() {
  return (
    <div className="bg-[#0A0E14] p-5 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────
function AirQualityError() {
  return (
    <div className="bg-[#0A0E14] p-5 rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[200px]">
      <div className="w-10 h-10 rounded-xl bg-[#E63946]/10 border border-[#E63946]/25 flex items-center justify-center">
        <AlertTriangle size={18} color="#E63946" />
      </div>
      <p className="text-sm text-[#B4C3CC] font-medium">Failed to load sensor data</p>
      <p className="text-[11px] text-[#58717D]">Check your connection and try again</p>
    </div>
  );
}

// ── Main UI ────────────────────────────────────────────────────────────────
function AirQualityUI({ data }: { data: SensorData }) {
  const aqiInfo     = getAQIInfo(data.aqi);
  const mq135Status = getMQ135Status(data.mq135);
  const presStatus  = getPressureStatus(data.pressure);
  const humidity = gethumidityStatus(data.humidity);
  const coLevel     = getCoLevel(data.co);
  const co2Level    = getCo2Level(data.co2);

  const mq135Color  = mq135Status === "danger" ? "#E63946" : mq135Status === "warning" ? "#F4A623" : "#2EC4A9";
  const presColor   = presStatus  === "warning" ? "#F4A623" : "#2EC4A9";

  const mq135Pct    = Math.min((data.mq135 / 15) * 100, 100);
  const presPct     = Math.min(((data.pressure - 950) / 100) * 100, 100);
  const altPct      = Math.min((data.altitude / 500) * 100, 100);

  const showCorrelation = data.co >= 7 && data.smoke === "High";

  return (
    <div className="bg-[#0A0E14] py-10 px-3 rounded-2xl flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[25px] font-medium text-[#F4FEFE]">Air Quality</h2>
          <p className="text-[11px] text-[#58717D] mt-0.5">MQ135 · Pressure · Altitude . humidity</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#2EC4A9]/10 border border-[#2EC4A9]/25 px-2.5 py-1 rounded-full">
          <Wifi size={11} color="#2EC4A9" />
          <span className="text-[9px] font-bold text-[#2EC4A9] tracking-widest">LIVE</span>
        </div>
      </div>

      {/* AQI Hero */}
      <div
        className="bg-[#182B31] rounded-xl p-4 flex items-center justify-between gap-6"
        style={{ border: `1px solid ${aqiInfo.color}44` }}
      >
        <div>
          <p className="text-[10px] text-[#58717D] uppercase tracking-widest mb-1">AQI Index</p>
          <p className="text-5xl font-semibold leading-none tabular-nums" style={{ color: aqiInfo.color }}>
            {data.aqi}
          </p>
          <p className="text-xs font-medium mt-1.5" style={{ color: aqiInfo.color }}>
            {aqiInfo.label}
          </p>
          <p className="text-[10px] text-[#58717D] mt-0.5">Fire Station — Smart City</p>
        </div>

        <div className="flex-1">
          <div
            className="relative h-2 rounded-full overflow-visible mb-2"
            style={{ background: "linear-gradient(to right, #2EC4A9, #F4E623, #F4A623, #E63946)" }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F4FEFE] -translate-x-1/2 transition-all duration-700"
              style={{ left: getAQIMarkerLeft(data.aqi), border: `2px solid ${aqiInfo.color}` }}
            />
          </div>
          <div className="flex justify-between">
            {(["Good", "Moderate", "Unhealthy", "Hazardous"] as const).map((l, i) => (
              <span key={l} className="text-[9px]"
                style={{ color: ["#2EC4A9", "#F4E623", "#F4A623", "#E63946"][i] }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Sensor Cards */}
      <div className="grid grid-cols-4 gap-3">
        <SensorCard
          label="MQ135" sub="Air quality sensor"
          value={data.mq135} unit="ppm CO"
          pct={mq135Pct} status={mq135Status}
          icon={<MQ135Icon color={mq135Color} />}
        />
        <SensorCard
          label="Pressure" sub="Atmospheric pressure"
          value={data.pressure} unit="hPa"
          pct={presPct} status={presStatus}
          icon={<PressureIcon color={presColor} />}
        />
        <SensorCard
          label="Altitude" sub="Elevation above sea level"
          value={data.altitude} unit="m"
          pct={altPct} status="stable"
          icon={<AltitudeIcon color="#B4C3CC" />}
        />
        <SensorCard
          label="Humidity" sub=" concentration of water vapor"
          value={data.altitude} unit="m"
          pct={altPct} status="stable"
          icon={<AltitudeIcon color="#B4C3CC" />}
        />
      </div>
      

      {/* Gas Breakdown */}
      <div className="bg-[#182B31] border border-[#58717D]/20 rounded-xl p-4">
        <p className="text-[10px] text-[#58717D] uppercase tracking-widest font-medium mb-3">
          MQ135 Gas Breakdown
        </p>
        <div className="grid grid-cols-2 gap-2">
          <GasItem name="CO — Carbon Monoxide"  value={`${data.co} ppm`}  level={coLevel}   />
          <GasItem name="CO₂ — Carbon Dioxide"  value={`${data.co2} ppm`} level={co2Level}  />
          <GasItem name="Smoke particles"        value={data.smoke}         level={data.smoke} />
          <GasItem name="NH₃ / Benzene"          value={data.nh3}           level={data.nh3}   />
        </div>

        {showCorrelation && (
          <div className="mt-3 p-2.5 bg-[#F4A623]/07 border border-[#F4A623]/20 rounded-lg flex items-start gap-2">
            <AlertTriangle size={13} color="#F4A623" className="mt-0.5 shrink-0" />
            <p className="text-[10px] text-[#B4C3CC] leading-relaxed">
              <span className="text-[#F4A623] font-medium">AI Correlation: </span>
              Fire detection correlated with rising CO and smoke — high confidence event confirmed by MQ135
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function AirQuality() {
  const { data, isLoading, isError } = useAirQuality();

  if (isLoading) return <AirQualitySkeleton />;
  if (isError || !data) return <AirQualityError />;

  return <AirQualityUI data={data} />;
}