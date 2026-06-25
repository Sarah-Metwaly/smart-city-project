import { useIncidents } from "../../../../shared/hooks/useIncidentTable";
import DonutChart from "../../../../shared/ui/molecules/DonutChart";

export default function CrimeStatus() {
  const { Incidents, isError, isLoading } = useIncidents('/api/v1/incidents/DailyIncidents');

  const highCount   = Incidents?.filter((i) => i.priority?.toUpperCase() === "HIGH").length   ?? 0;
  const mediumCount = Incidents?.filter((i) => i.priority?.toUpperCase() === "MEDIUM").length ?? 0;
  const lowCount    = Incidents?.filter((i) => i.priority?.toUpperCase() === "LOW").length    ?? 0;
  const total       = highCount + mediumCount + lowCount;

  const data = [
    { id: 0, value: highCount,   label: 'High',   color: '#f06261', pct: total ? Math.round((highCount   / total) * 100) : 0 },
    { id: 1, value: mediumCount, label: 'Medium', color: '#ffb338', pct: total ? Math.round((mediumCount / total) * 100) : 0 },
    { id: 2, value: lowCount,    label: 'Low',    color: '#14B8A6', pct: total ? Math.round((lowCount    / total) * 100) : 0 },
  ];

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top glow edge */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }}
      />

      {/* Scanline texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }}
      />

      <div className="relative flex flex-col p-4 gap-3">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500" />
            </span>
            <h2 className="text-xs font-semibold tracking-wide" style={{ color: '#F4FEFE' }}>
              Incident Status
            </h2>
          </div>

          {/* Total pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(10,14,20,0.6)',
              border: '1px solid rgba(88,113,125,0.18)',
            }}
          >
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#58717D]/55 uppercase">Total</span>
            <span className="text-xs font-mono font-bold tabular-nums" style={{ color: '#B4C3CC' }}>
              {isLoading ? '—' : total}
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px"
          style={{ background: 'linear-gradient(90deg,rgba(88,113,125,0.3),rgba(88,113,125,0.08),transparent)' }}
        />

        {/* ── Content ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(88,113,125,0.15)' }} />
                <div className="absolute inset-0 rounded-full border-2 border-t-[#58717D] border-transparent animate-spin" />
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#58717D]/50 uppercase">Loading</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 font-bold text-sm"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>!</div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-red-400/60 uppercase">Error loading data</span>
            </div>
          </div>
        ) : (
          <>
            {/* Donut — unchanged size */}
            <div className="flex justify-center">
              <DonutChart
                data={data}
                width={240}
              />
            </div>

            {/* ── Legend ── */}
            <div className="flex flex-col gap-1.5">
              {data.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  {/* Dot */}
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.color, boxShadow: `0 0 5px ${item.color}55` }}
                  />
                  {/* Label */}
                  <span className="text-[10px] font-mono tracking-[0.12em] uppercase w-12 flex-shrink-0"
                    style={{ color: 'rgba(180,195,204,0.55)' }}>
                    {item.label}
                  </span>
                  {/* Bar */}
                  <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(88,113,125,0.15)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.pct}%`, background: item.color, opacity: 0.7 }}
                    />
                  </div>
                  {/* Count · % */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color: item.color }}>
                      {item.value}
                    </span>
                    <span className="text-[9px] font-mono tabular-nums" style={{ color: 'rgba(88,113,125,0.45)' }}>
                      {item.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(88,113,125,0.2),transparent)' }}
      />
    </div>
  );
}