import React from 'react';
import {
  Flame,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

import { useFlameSensor } from '../hooks/useFlame';
import { useActivePower } from '../../energy-optimization/hooks/useActivePower';

export const Sensors: React.FC = () => {
  const {
    flameSensorData,
    isFlameDetected,
    isLoading,
    isError,
  } = useFlameSensor();

  const {
    DHT11Value,
    isLoading: isDHT11Loading ,
    isError: isDHT11Error,
  } = useActivePower();

  const DANGER_THRESHOLD = 45;

  const isDangerous = DHT11Value
    ? DHT11Value.temperature > DANGER_THRESHOLD
    : false;

  const flameRiskColor =
    flameSensorData?.risk_level === 'DANGER'
      ? 'text-red-400 animate-pulse'
      : flameSensorData?.risk_level === 'WARNING'
      ? 'text-amber-400'
      : 'text-aman-light';

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ================= FLAME SENSOR ================= */}
        <div
          className={`w-full lg:flex-1 min-w-0 overflow-hidden rounded-2xl transition-all duration-300
            ${
              isFlameDetected
                ? 'bg-aman-dark/80'
                : 'bg-aman-teal'
            }`}
        >
          {/* Top Status Bar */}
          <div
            className={`h-1 w-full
              ${
                isFlameDetected
                  ? 'bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse'
                  : 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
              }`}
          />

          <div className="p-4 sm:p-5 lg:p-6">
            {isLoading ? (
              <p className="py-12 text-center text-sm font-mono text-aman-light/40 animate-pulse">
                Loading Flame Telemetry...
              </p>
            ) : isError || !flameSensorData ? (
              <p className="py-12 text-center text-sm font-mono text-red-400">
                Failed to read Flame Sensor.
              </p>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center
                        ${
                          isFlameDetected
                            ? 'bg-red-400/10 border-red-400/20'
                            : 'bg-aman-light/5 border-aman-light/10'
                        }`}
                    >
                      <Flame
                        size={20}
                        className={
                          isFlameDetected
                            ? 'text-red-400'
                            : 'text-aman-blue'
                        }
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-aman-white">
                        {flameSensorData._id || 'Flame Sensor'}
                      </h3>

                      <p className="text-[10px] font-mono text-aman-blue/60">
                        Flame Module
                      </p>
                    </div>
                  </div>

                  {isFlameDetected ? (
                    <ShieldAlert
                      size={18}
                      className="text-red-400 animate-pulse"
                    />
                  ) : (
                    <ShieldCheck
                      size={18}
                      className="text-emerald-400"
                    />
                  )}
                </div>

                {/* Data Rows */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-aman-light/10 bg-aman-dark/55 px-4 py-3">
                    <span className="text-sm text-aman-light/70">
                      Status
                    </span>

                    <span
                      className={`font-mono font-bold text-sm tracking-wide
                        ${
                          isFlameDetected
                            ? 'text-red-400 animate-pulse'
                            : 'text-emerald-400'
                        }`}
                    >
                      {flameSensorData.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-aman-light/10 bg-aman-dark/55 px-4 py-3">
                    <span className="text-sm text-aman-light/70">
                      Risk Level
                    </span>

                    <span
                      className={`font-mono font-bold tracking-wider ${flameRiskColor}`}
                    >
                      {flameSensorData.risk_level}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-aman-light/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-aman-blue/50">
                    Flame Module
                  </span>

                  <span className="text-[10px] font-mono text-aman-blue/40 break-all">
                    {new Date(
                      flameSensorData.timeStamp
                    ).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= TEMPERATURE SENSOR ================= */}
        <div
          className={`w-full lg:flex-1 min-w-0 overflow-hidden rounded-2xl transition-all duration-300
            ${
              isDangerous
                ? 'bg-aman-dark/80'
                : 'bg-aman-teal'
            }`}
        >
          {/* Top Status Bar */}
          <div
            className={`h-1 w-full
              ${
                isDangerous
                  ? 'bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse'
                  : 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
              }`}
          />

          <div className="p-4 sm:p-5 lg:p-6">
            {isDHT11Loading ? (
              <p className="py-12 text-center text-sm font-mono text-aman-light/40 animate-pulse">
                Loading Temperature Telemetry...
              </p>
            ) : isDHT11Error || !DHT11Value ? (
              <p className="py-12 text-center text-sm font-mono text-red-400">
                Failed to read Temperature Sensor.
              </p>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center
                        ${
                          isDangerous
                            ? 'bg-amber-400/10 border-amber-400/20'
                            : 'bg-aman-light/5 border-aman-light/10'
                        }`}
                    >
                      <Thermometer
                        size={20}
                        className={
                          isDangerous
                            ? 'text-amber-400'
                            : 'text-aman-blue'
                        }
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-aman-white">
                        Temperature Sensor
                      </h3>

                      <p className="text-[10px] font-mono text-aman-blue/60">
                        BMP180
                      </p>
                    </div>
                  </div>

                  {isDangerous ? (
                    <ShieldAlert
                      size={18}
                      className="text-amber-400 animate-pulse"
                    />
                  ) : (
                    <ShieldCheck
                      size={18}
                      className="text-emerald-400"
                    />
                  )}
                </div>

                {/* Data Rows */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-aman-light/10 bg-aman-dark/55 px-4 py-3">
                    <span className="text-sm text-aman-light/70">
                      Temperature
                    </span>

                    <span
                      className={`font-mono font-black text-xl sm:text-2xl lg:text-3xl
                        ${
                          isDangerous
                            ? 'text-red-400 animate-pulse'
                            : 'text-aman-white'
                        }`}
                    >
                      {DHT11Value.temperature}°C
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-aman-light/10 bg-aman-dark/55 px-4 py-3">
                    <span className="text-sm text-aman-light/70">
                      System Status
                    </span>

                    <span
                      className={`font-mono font-bold text-sm
                        ${
                          isDangerous
                            ? 'text-red-400'
                            : 'text-aman-blue'
                        }`}
                    >
                      {isDangerous
                        ? 'CRITICAL OVERHEAT'
                        : DHT11Value.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-aman-light/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-aman-blue/50">
                    Thermal Module
                  </span>

                  <span className="text-[10px] font-mono text-aman-blue/40 break-all">
                    {new Date(
                      DHT11Value.timeStamp
                    ).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

