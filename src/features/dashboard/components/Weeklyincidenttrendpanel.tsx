import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useWeeklyTrend } from "../../police-surveillance/hooks/useWeeklyTrend";

function formatDayLabel(id: string) {
  const d = new Date(id);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  }
  return id.slice(0, 3).toUpperCase();
}

const BAR_COLOR = "#8B98A5";
const BAR_HOVER_COLOR = "#C3CCD4";

export function WeeklyIncidentTrendPanel() {
  const { data, isLoading, isError } = useWeeklyTrend();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const grandTotal = data.reduce((sum, point) => sum + point.total, 0);
  const maxTotal = Math.max(1, ...data.map((p) => p.total));

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-aman-teal flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-aman-light" />
          </div>
          <span className="text-[12px] font-medium tracking-wide text-aman-white leading-tight">
            WEEKLY INCIDENT TREND
          </span>
        </div>
        <span className="bg-aman-blue/20 text-aman-white px-2 py-0.5 rounded-[8px] text-[10px] font-bold">
          TOTAL {grandTotal}
        </span>
      </div>

      {isLoading && <p className="text-[12px] text-aman-blue">Loading...</p>}
      {isError && <p className="text-[12px] text-red-500">Failed to load weekly trend.</p>}

      {!isLoading && !isError && (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 flex items-end justify-between gap-2.5 px-1 pb-1">
            {data.map((point) => {
              const heightPct = Math.max(8, (point.total / maxTotal) * 100);
              const isHovered = hoveredId === point._id;
              return (
                <div
                  key={point._id}
                  className="relative flex flex-col items-center gap-1.5 flex-1 h-full justify-end"
                  onMouseEnter={() => setHoveredId(point._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-aman-teal px-2 py-1 text-[10px] font-mono font-semibold text-aman-white shadow-lg z-10">
                      {point.total} incidents
                    </div>
                  )}

                  <span
                    className="text-[10px] font-mono font-semibold transition-colors"
                    style={{ color: isHovered ? BAR_HOVER_COLOR : "#B4C3CC" }}
                  >
                    {point.total}
                  </span>

                  <div
                    className="w-full rounded-t-md cursor-pointer transition-all duration-200"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: "10px",
                      backgroundColor: isHovered ? BAR_HOVER_COLOR : BAR_COLOR,
                    }}
                  />
                  <span className="text-[9px] text-aman-blue uppercase font-medium">
                    {formatDayLabel(point._id)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 mt-1 border-t border-aman-teal/60 shrink-0">
            <div className="flex flex-col">
              <span className="text-[9px] text-aman-blue uppercase">Days Tracked</span>
              <span className="text-[12px] font-mono font-semibold text-aman-white">
                {data.length}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-aman-blue uppercase">Avg / Day</span>
              <span className="text-[12px] font-mono font-semibold" style={{ color: BAR_COLOR }}>
                {data.length > 0 ? Math.round(grandTotal / data.length) : 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}