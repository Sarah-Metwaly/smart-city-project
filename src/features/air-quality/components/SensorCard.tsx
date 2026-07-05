import React from "react";
import {type  AQStatus } from "../types/airQuality";
import { statusStyles, statusLabel } from "../constants";

// ── Main Component ─────────────────────────────────────────────────────────
interface SensorCardProps {
  label: string;
  sub: string;
  value: number;
  unit: string;
  pct: number;
  status: AQStatus;
  icon: React.ReactNode;
}

export default function SensorCard({
  label,
  sub,
  value,
  unit,
  pct,
  status,
  icon,
}: SensorCardProps) {
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