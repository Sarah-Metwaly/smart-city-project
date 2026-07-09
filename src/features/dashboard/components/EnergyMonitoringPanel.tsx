import { Zap, Lightbulb, Gauge, DollarSign } from "lucide-react";
import { useTotalData } from "../../../shared/hooks/useTotalData";
import { useLightSystem } from "../../energy-optimization/hooks/useLightsytem";
import { useActivePower } from "../../energy-optimization/hooks/useActivePower";

const TOTAL_LIGHTS = 3;
const ON_LIGHTS_WHEN_ACTIVE = 3;

export function EnergyMonitoringPanel() {
  const { isLightsOn, hasData: hasLightData } = useLightSystem();
  const { Total, trend, isTotalLoading, isTotalError } = useTotalData();
  const {TotalPower}=useActivePower()

  const isLoading = isTotalLoading;
  const isError = isTotalError;

  const onCount = isLightsOn ? ON_LIGHTS_WHEN_ACTIVE : 0;
  const onPercent = hasLightData
    ? parseFloat(((onCount / TOTAL_LIGHTS) * 100).toFixed(1))
    : 0;

  const metrics = [
    {
      id: 0,
      icon: <Zap className="h-4 w-4" />,
      label: "Load",
      value: `${TotalPower}`,
      unit: "W",
      trend: trend?.avgPowerComment,
      color: "#E05A5A",
    },
    {
      id: 1,
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Lights",
      value: `${onCount}/${TOTAL_LIGHTS}`,
      unit: "",
      trend: `${onPercent}%`,
      color: "#1A8A80",
    },
    {
      id: 2,
      icon: <Gauge className="h-4 w-4" />,
      label: "Energy",
      value: `${Total?.totalEnergy ?? 0}`,
      unit: "KW",
      trend: trend?.energyChangeComment,
      color: "#58A6A6",
    },
    {
      id: 3,
      icon: <DollarSign className="h-4 w-4" />,
      label: "Cost",
      value: `${Total?.totalCost ?? 0}`,
      unit: "$",
      trend: trend?.costChangeComment,
      color: "#E09A3D",
    },
  ];

  return (
    <div className="relative h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-3 sm:px-4 py-3 sm:py-3.5 overflow-hidden">
      {/* HUD accent strip */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0 min-w-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center shrink-0">
            <Zap className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[12px] sm:text-[13px] font-medium tracking-wide text-aman-white leading-tight truncate">
            ENERGY
            <br />
            MONITORING
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider text-emerald-400 self-start shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          STABLE
        </span>
      </div>

      {isLoading && <p className="text-[12px] text-aman-blue">Loading...</p>}
      {isError && <p className="text-[12px] text-red-500">Failed to load energy data.</p>}

      {/* Fixed 2x2 metric grid — fills remaining space, no scroll */}
      {!isLoading && !isError && (
        <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="rounded-lg bg-aman-teal/60 px-2.5 sm:px-3 py-2 flex flex-col justify-center gap-1 min-w-0 min-h-[56px]"
            >
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="shrink-0" style={{ color: m.color }}>{m.icon}</span>
                  <span className="text-[9px] sm:text-[9.5px] tracking-wider text-aman-blue uppercase truncate">
                    {m.label}
                  </span>
                </div>
                {m.trend != null && (
                  <span className="bg-aman-blue/20 text-aman-white px-1.5 py-0.5 rounded-[8px] text-[9px] font-bold shrink-0 max-w-[56px] sm:max-w-[72px] truncate">
                    {m.trend}
                  </span>
                )}
              </div>
              <span className="text-[14px] sm:text-[16px] font-mono font-semibold tabular-nums truncate" style={{ color: m.color }}>
                {m.value}
                {m.unit && <span className="text-[10px] text-aman-blue ml-0.5">{m.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}