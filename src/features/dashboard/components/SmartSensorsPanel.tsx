import { Zap } from 'lucide-react';
import { useFlameSensor } from '../../fire-department/hooks/useFlame';
import { useActivePower } from '../../energy-optimization/hooks/useActivePower';

const SmartSensorPanel = () => {
  const {
    LDRData,
    DHT11Value,
    MQResponse,
    getPercent,
    TotalPower,
    isLoading,
    isError,
  } = useActivePower();
  const { flameSensorData } = useFlameSensor();

  const sensors = [
    {
      id: 0,
      label: 'LDR',
      realValue: LDRData?.power ?? 0,
      value: getPercent(LDRData?.power ?? 0),
      color: '#14B8A6',
    },
    {
      id: 1,
      label: 'DHT11',
      realValue: DHT11Value?.power ?? 0,
      value: getPercent(DHT11Value?.power ?? 0),
      color: '#3B82F6',
    },
    {
      id: 2,
      label: 'MQ',
      realValue: MQResponse?.power ?? 0,
      value: getPercent(MQResponse?.power ?? 0),
      color: '#F59E0B',
    },
    {
      id: 3,
      label: 'Flame',
      realValue: flameSensorData?.power ?? 0,
      value: getPercent(flameSensorData?.power ?? 0),
      color: '#FACC15',
    },
  ];

  const highest = sensors.reduce(
    (a, b) => (b.value > a.value ? b : a),
    sensors[0],
  );

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
          <span className="text-[12px] sm:text-[13px] font-medium tracking-wide text-aman-white truncate">
            SMART SENSOR POWER
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider text-emerald-400 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      {isLoading && <p className="text-[12px] text-aman-blue">Loading...</p>}
      {isError && (
        <p className="text-[12px] text-red-500">Failed to load sensor data.</p>
      )}

      {!isLoading && !isError && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3 shrink-0">
            <Stat
              label="TOTAL"
              value={`${TotalPower}W`}
              className="text-aman-white"
            />
            <Stat
              label="TOP LOAD"
              value={highest.label}
              className="text-amber-500"
            />
            <Stat
              label="SHARE"
              value={`${highest.value}%`}
              className="text-emerald-400"
            />
          </div>

          {/* Stacked bar */}
          <div className="flex h-2 w-full rounded-full overflow-hidden mb-3 bg-white/5 shrink-0">
            {sensors.map((s) => (
              <div
                key={s.id}
                className="h-full transition-all duration-300"
                style={{ width: `${s.value}%`, backgroundColor: s.color }}
              />
            ))}
          </div>

          {/* Sensor grid — fixed 2x2, */}
          <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2">
            {sensors.map((s) => (
              <div
                key={s.id}
                className="rounded-lg bg-aman-teal/60 px-2.5 sm:px-3 py-2 flex flex-col justify-center gap-1 min-w-0 min-h-[56px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: s.color,
                      boxShadow: `0 0 6px ${s.color}88`,
                    }}
                  />
                  <span className="text-[8px] tracking-wider text-aman-blue uppercase truncate">
                    {s.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1 min-w-0">
                  <span className="text-[13px] sm:text-[14px] font-mono font-semibold text-aman-white tabular-nums truncate">
                    {s.realValue}
                    <span className="text-[8px] text-aman-blue ml-0.5">W</span>
                  </span>
                  <span
                    className="text-[11px] sm:text-[12px] font-mono font-bold shrink-0 tabular-nums"
                    style={{ color: s.color }}
                  >
                    {s.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] tracking-wider text-aman-blue mb-1 truncate">
        {label}
      </p>
      <p
        className={`text-[16px] sm:text-[20px] font-medium leading-none truncate ${className}`}
      >
        {value}
      </p>
    </div>
  );
}

export default SmartSensorPanel;
