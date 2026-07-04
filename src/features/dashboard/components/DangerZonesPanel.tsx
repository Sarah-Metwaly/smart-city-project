import { MapPin } from 'lucide-react';

/**
 * DangerZonesPanel
 * ---------------------------------------------------------------------------
 * Left column, bottom card. Ranked list of monitored zones with a risk %
 * and a horizontal progress bar colored by severity band.
 *
 * Data: static mock — swap for `useDangerZones()` once the API exists.
 * ---------------------------------------------------------------------------
 */

interface Zone {
  name: string;
  area: string;
  risk: number; // 0-100
}

const MOCK_ZONES: Zone[] = [
  { name: 'Zone A', area: 'Industrial', risk: 82 },
  { name: 'Zone B', area: 'Highway 4', risk: 64 },
  { name: 'Zone C', area: 'Residential', risk: 28 },
  { name: 'Zone D', area: 'Commercial', risk: 65 },
];

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

      {/* Zone list — flex-1 + min-h-0 bounds this to the card's remaining
          height so it scrolls internally instead of overflowing the card
          and getting clipped by overflow-hidden above. */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto min-h-0">
        {MOCK_ZONES.map((zone) => (
          <ZoneRow key={zone.name} zone={zone} />
        ))}
      </div>
    </div>
  );
}

function ZoneRow({ zone }: { zone: Zone }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] text-aman-white">
          {zone.name} · {zone.area}
        </span>
        <span className={`text-[12px] font-medium ${riskTextColor(zone.risk)}`}>
          {zone.risk}% RISK
        </span>
      </div>
      <div className="h-1 rounded-full bg-aman-teal overflow-hidden">
        <div
          className={`h-full rounded-full ${riskColor(zone.risk)}`}
          style={{ width: `${zone.risk}%` }}
        />
      </div>
    </div>
  );
}