import { MapPin } from 'lucide-react';
import { useDangerZones } from '../../../shared/hooks/useDangerZones';

/**
 * DangerZonesPanel
 * ---------------------------------------------------------------------------
 * Left column, bottom card. Ranked list of monitored zones with a risk %
 * and a horizontal progress bar colored by severity band.
 *
 * Data: GET /api/v1/dangerZones/weekly via useDangerZones()
 * ---------------------------------------------------------------------------
 */

function riskColor(risk: number): string {
  if (risk >= 70) return 'bg-red-500';
  if (risk >= 45) return 'bg-amber-500';
  return 'bg-emerald-400';
}

function riskTextColor(risk: number): string {
  if (risk >= 70) return 'text-red-500';
  if (risk >= 45) return 'text-amber-500';
  return 'text-emerald-400';
}

export function DangerZonesPanel() {
  const { data, isLoading, isError } = useDangerZones();
  const zones = data ?? [];

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <MapPin className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white">
            DANGER ZONES
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] tracking-wider text-amber-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          MONITORING
        </span>
      </div>

      {isLoading && (
        <p className="text-[12px] text-aman-blue">Loading...</p>
      )}
      {isError && (
        <p className="text-[12px] text-red-500">Failed to load danger zones.</p>
      )}

      {!isLoading && !isError && (
        <div
          className="
            flex-1 flex flex-col gap-2.5 overflow-y-auto min-h-0 pr-1
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-aman-teal
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-aman-blue/60
          "
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#1A8A80 transparent' }}
        >
          {zones.map((zone) => (
            <ZoneRow key={zone.zone} name={zone.zone} risk={zone.percentage} />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneRow({ name, risk }: { name: string; risk: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] text-aman-white">{name}</span>
        <span className={`text-[12px] font-medium ${riskTextColor(risk)}`}>
          {risk}% RISK
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-aman-teal/50 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${riskColor(risk)}`}
          style={{ width: `${risk}%` }}
        />
      </div>
    </div>
  );
}