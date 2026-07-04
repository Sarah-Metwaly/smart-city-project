import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

/**
 * ReportsAnalyticsPanel
 * ---------------------------------------------------------------------------
 * Left column, middle card. Small bar chart of report volume over the last
 * 24h plus a 3-stat summary row (total / trend / resolved rate).
 *
 * Data: static mock — swap for `useReportsAnalytics()` (TanStack Query) once
 * the API exists. Chart uses Recharts per the project's chart library.
 * ---------------------------------------------------------------------------
 */

const MOCK_BARS = [4, 6, 5, 8, 9, 7, 10, 8, 6, 7, 5, 6].map((v, i) => ({
  hour: i,
  value: v,
}));

const MOCK_STATS = { total: 284, trend: '+12%', resolved: '94%' };

export function ReportsAnalyticsPanel() {
  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <BarChart3 className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white">
            REPORTS ANALYTICS
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] tracking-wider text-aman-blue">
          <span className="h-1.5 w-1.5 rounded-full bg-aman-blue" />
          24H
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex-1 min-h-[60px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_BARS} barGap={4}>
            <Bar dataKey="value" fill="#58717D" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mt-3 shrink-0">
        <Stat label="TOTAL" value={MOCK_STATS.total} className="text-aman-white" />
        <Stat label="TREND" value={MOCK_STATS.trend} className="text-emerald-400" />
        <Stat label="RESOLVED" value={MOCK_STATS.resolved} className="text-aman-light" />
      </div>
    </div>
  );
}

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
    <div>
      <p className="text-[10px] tracking-wider text-aman-blue mb-1">{label}</p>
      <p className={`text-[20px] font-medium leading-none ${className}`}>{value}</p>
    </div>
  );
}