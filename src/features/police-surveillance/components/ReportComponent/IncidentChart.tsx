import { BarChart } from "@mui/x-charts/BarChart";
import { useWeeklyTrend } from '../../hooks/useWeeklyTrend';
import { useRef, useEffect, useState } from 'react';

const GREY = '#9CA3AF';

const getDayName = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const getColor = (total: number) => {
  if (total >= 15) return '#C85353';
  if (total >= 10) return '#D29442';
  return '#9FB3C2';
};

export default function WeeklyType() {
  const { data, isLoading, isError } = useWeeklyTrend();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(520);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const stateUI = (content: React.ReactNode) => (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        height: 270,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8,
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{content}</div>
    </div>
  );

  if (isLoading) return stateUI(<span style={{ color: GREY, fontSize: 12 }}>Loading...</span>);
  if (isError)   return stateUI(<span style={{ color: '#E05A5A', fontSize: 12 }}>Error loading data</span>);

  const dataset = data && data.length > 0
    ? data.map((d: any) => ({
        day:   d._id?.includes('-') ? getDayName(d._id) : d._id,
        total: d.total || 0,
      }))
    : [];

  const totalIncidents = dataset.reduce((acc, d) => acc + d.total, 0);
  const hasData = dataset.some((d) => d.total > 0);

  if (!hasData) return stateUI(<span style={{ color: GREY, fontSize: 13 }}>No incidents this week</span>);

  const maxVal = Math.max(...dataset.map(d => d.total));
  const yMax   = Math.ceil(maxVal * 1.3);

  const series = dataset.map((item, index) => ({
    id: `bar-${index}`,
    data: dataset.map((_, i) => (i === index ? item.total : null)),
    color: getColor(item.total),
    valueFormatter: (v: number | null) => (v != null ? `${v}` : ''),
    stack: 'total',
    label: item.day,
  }));

  return (
    <div
      className="relative flex flex-col w-full overflow-hidden rounded-2xl"
      style={{
        height: 270,
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        padding: '20px 16px 16px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />

      <div className="flex items-center justify-between w-full mb-1" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span className="text-white font-medium text-[15px] tracking-wide">Weekly Incident Trend</span>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(88,113,125,0.15)' }}
        >
          <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold">Total</span>
          <span className="text-xs font-bold text-white">{totalIncidents}</span>
        </div>
      </div>

      <div className="w-full h-px mb-6"
        style={{ background: 'linear-gradient(90deg, rgba(88,113,125,0.25), transparent)' }} />

      <div ref={containerRef} className="relative flex items-center justify-center flex-1 w-full min-h-0">
        <BarChart
          dataset={dataset}
          height={200}
          width={chartWidth || 520}
          xAxis={[{
            scaleType: 'band',
            dataKey: 'day',
            disableTicks: true,
            disableLine: true,
            tickLabelStyle: { fill: '#94A3B8', fontSize: 11, fontWeight: 500 },
          }]}
          yAxis={[{
            disableTicks: true,
            disableLine: true,
            tickLabelStyle: { fill: '#94A3B8', fontSize: 11 },
            min: 0,
            max: yMax,
          }]}
          series={series}
          borderRadius={6}
          slotProps={{ legend: { sx: { display: 'none' } } }}
          margin={{ top: 25, right: 30, bottom: 25, left: 0 }}
          sx={{
            zIndex: 1,
            '& .MuiChartsAxis-tickLabel tspan': { fill: '#94A3B8 !important' },
          }}
        />
      </div>
    </div>
  );
}