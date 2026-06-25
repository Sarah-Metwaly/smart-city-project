import React from 'react';
import { useFlameSensor } from '../hooks/useFlame';
import { useActivePower } from '../../energy-optimization/hooks/useActivePower';

export const Sensors: React.FC = () => {
  const { flameSensorData, isFlameDetected, isLoading, isError } = useFlameSensor();
  const { BMB180Value, isLoading: isBMB180Loading, isError: isBMB180Error } = useActivePower();

  const DANGER_THRESHOLD = 45;
  const isDangerous = BMB180Value ? BMB180Value.temperature > DANGER_THRESHOLD : false;

  return (
    <div className="flex flex-col sm:flex-row gap-6 max-w-full">

      {/* ==================== CARD 1: FLAME SENSOR ==================== */}
      <div className={`flex-1 w-full max-w-sm p-5 rounded-2xl border transition-all duration-300
        ${isFlameDetected
          ? 'bg-red-950/20 border-red-500/50 ring-2 ring-red-500/10'
          : 'bg-aman-teal border-aman-light/20'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-aman-light text-sm font-medium animate-pulse">
            Loading Flame Telemetry...
          </div>
        ) : isError || !flameSensorData ? (
          <div className="text-center p-6 text-red-400 text-sm font-semibold border border-red-500/20 rounded-xl bg-red-950/30">
            Failed to read Flame Sensor.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-[15px] font-semibold text-aman-white tracking-wide">
                  {flameSensorData.sensor_id || "Flame Sensor"}
                </h3>
                <p className="text-[10px] text-aman-light/55 mt-1 font-mono">
                  {new Date(flameSensorData.timeStamp).toLocaleString()}
                </p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0
                ${isFlameDetected
                  ? 'bg-red-400 animate-ping shadow-sm shadow-red-400/30'
                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/30'}`}
              />
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-3 rounded-xl bg-aman-dark/45 border border-aman-light/8 text-sm">
                <span className="text-aman-light">Status</span>
                <span className={`font-mono font-bold tracking-wide
                  ${isFlameDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {flameSensorData.status}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-aman-dark/45 border border-aman-light/8 text-sm">
                <span className="text-aman-light">Risk Level</span>
                <span className={`font-mono font-extrabold tracking-wider
                  ${flameSensorData.risk_level === 'DANGER'
                    ? 'text-red-400 animate-pulse'
                    : flameSensorData.risk_level === 'WARNING'
                    ? 'text-amber-400'
                    : 'text-aman-light'}`}>
                  {flameSensorData.risk_level}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==================== CARD 2: BMP180 TEMP SENSOR ==================== */}
      <div className={`flex-1 w-full max-w-sm p-5 rounded-2xl border transition-all duration-300
        ${isDangerous
          ? 'bg-red-950/20 border-red-500/50 ring-2 ring-red-500/10'
          : 'bg-aman-teal border-aman-light/20'}`}
      >
        {isBMB180Loading ? (
          <div className="flex items-center justify-center p-8 text-aman-light text-sm font-medium animate-pulse">
            Loading Temp Telemetry...
          </div>
        ) : isBMB180Error || !BMB180Value ? (
          <div className="text-center p-6 text-red-400 text-sm font-semibold border border-red-500/20 rounded-xl bg-red-950/30">
            Failed to read Temp Sensor.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-[15px] font-semibold text-aman-white tracking-wide">Temp Sensor</h3>
                <p className="text-[10px] text-aman-light/55 mt-1 font-mono">
                  {new Date(BMB180Value.timeStamp).toLocaleString()}
                </p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0
                ${isDangerous
                  ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400/30'
                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/30'}`}
              />
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-3 rounded-xl bg-aman-dark/45 border border-aman-light/8 text-sm">
                <span className="text-aman-light">Temperature</span>
                <span className={`font-mono font-black text-xl tracking-tight
                  ${isDangerous ? 'text-red-400 animate-pulse' : 'text-aman-white'}`}>
                  {BMB180Value.temperature}°C
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-aman-dark/45 border border-aman-light/8 text-sm">
                <span className="text-aman-light">System Status</span>
                <span className={`font-mono font-bold tracking-wide
                  ${isDangerous ? 'text-red-400' : 'text-aman-blue'}`}>
                  {isDangerous ? 'CRITICAL OVERHEAT' : BMB180Value.status}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};