import { AlertTriangle } from 'lucide-react';
import { useIncidents } from '../../../shared/hooks/useIncidentTable';
import type { Incident } from '../../../shared/hooks/useIncidentTable';

type Severity = 'high' | 'med' | 'low';

const SEVERITY_STYLES: Record<Severity, { label: string; className: string }> = {
  high: { label: 'HIGH', className: 'bg-red-500 text-red-950' },
  med: { label: 'MED', className: 'border border-amber-500 text-amber-500' },
  low: { label: 'LOW', className: 'border border-aman-blue text-aman-light' },
};

// API priority -> UI severity
function toSeverity(priority: Incident['priority']): Severity {
  if (priority === 'HIGH') return 'high';
  if (priority === 'MEDIUM') return 'med';
  return 'low';
}

// "FIRE_DETECTION" -> "Fire Detection"
function formatType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export function ActiveIncidentsPanel() {
  const { Incidents, isLoading, isError } = useIncidents('/api/v1/incidents/DailyIncidents');

  const active   = Incidents.filter((i) => i.status === 'ACTIVE').length;
  const critical = Incidents.filter((i) => i.priority === 'HIGH').length;
  const resolved = Incidents.filter((i) => i.status === 'RESOLVED').length;

  // show only active incidents in the list, most recent first
  const activeIncidents = Incidents
    .filter((i) => i.status === 'ACTIVE')
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white">
            ACTIVE INCIDENTS
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] tracking-wider text-red-500">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3.5 shrink-0">
        <Stat label="ACTIVE" value={active} className="text-amber-500" />
        <Stat label="CRITICAL" value={critical} className="text-red-500" />
        <Stat label="RESOLVED" value={resolved} className="text-emerald-400" />
      </div>

      {/* Incident list */}
      <div className="flex flex-col gap-2 overflow-y-auto min-h-0">
        {isLoading && (
          <p className="text-[12px] text-aman-blue">Loading incidents...</p>
        )}

        {isError && (
          <p className="text-[12px] text-red-500">Failed to load incidents.</p>
        )}

        {!isLoading && !isError && activeIncidents.length === 0 && (
          <p className="text-[12px] text-aman-blue">No active incidents.</p>
        )}

        {activeIncidents.map((incident) => (
          <IncidentRow key={incident._id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-wider text-aman-blue mb-1">{label}</p>
      <p className={`text-[22px] font-medium leading-none ${className}`}>{value}</p>
    </div>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const badge = SEVERITY_STYLES[toSeverity(incident.priority)];
  const title = `${formatType(incident.type)} · ${incident.location.name}`;

  return (
    <div className="rounded-lg bg-aman-teal px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-aman-blue">{incident.incidentId}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-[13px] text-aman-white">{title}</p>
    </div>
  );
}