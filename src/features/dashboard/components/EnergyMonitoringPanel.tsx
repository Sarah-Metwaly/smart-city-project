import { Zap, Lightbulb, Gauge, DollarSign } from "lucide-react";
import { useTotalData } from "../../../shared/hooks/useTotalData";
import { useLightSystem } from "../../energy-optimization/hooks/useLightsytem";


export function EnergyMonitoringPanel() {
  const { sensorData, isLoading: isLightLoading, isError: isLightError, getPercentage } = useLightSystem();
  const { Total, trend, isTotalLoading, isTotalError } = useTotalData();

  const isLoading = isLightLoading || isTotalLoading;
  const isError = isLightError || isTotalError;

  const onPercent = getPercentage(sensorData?.on);

  const metrics = [
    {
      id: 0,
      icon: <Zap className="h-4 w-4" />,
      label: "Active Load",
      value: `${Total?.totalActiveLoad ?? 0}`,
      unit: "W",
      trend: trend?.avgPowerComment,
      color: "#E05A5A",
    },
    {
      id: 1,
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Street Lights",
      value: `${sensorData?.on ?? 0}/${sensorData?.total ?? 0}`,
      unit: "",
      trend: `${onPercent}%`,
      color: "#1A8A80",
    },
    {
      id: 2,
      icon: <Gauge className="h-4 w-4" />,
      label: "Total Energy",
      value: `${Total?.totalEnergy ?? 0}`,
      unit: "KW",
      trend: trend?.energyChangeComment,
      color: "#58A6A6",
    },
    {
      id: 3,
      icon: <DollarSign className="h-4 w-4" />,
      label: "Total Cost",
      value: `${Total?.totalCost ?? 0}`,
      unit: "$",
      trend: trend?.costChangeComment,
      color: "#E09A3D",
    },
  ];

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white leading-tight">
            ENERGY
            <br />
            MONITORING
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] tracking-wider text-emerald-400 self-start">
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
              className="rounded-lg bg-aman-teal/60 px-3 py-2 flex flex-col justify-center gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <span className="text-[9.5px] tracking-wider text-aman-blue uppercase">
                    {m.label}
                  </span>
                </div>
                {m.trend != null && (
                  <span className="bg-aman-blue/20 text-aman-white px-1.5 py-0.5 rounded-[8px] text-[9px] font-bold shrink-0">
                    {m.trend}
                  </span>
                )}
              </div>
              <span className="text-[16px] font-mono font-semibold" style={{ color: m.color }}>
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