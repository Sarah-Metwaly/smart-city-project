import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useAvgResponseTime } from '../../../../features/police-surveillance/hooks/useAvgResponseTime';
import { useRef, useEffect, useState } from 'react';

const GREY = '#9CA3AF';
const RED = '#E05A5A';

function CustomMark(props: any) {
  const { x, y } = props;
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={RED} />
    </g>
  );
}

export default function TimeResponseChart() {
  const { data, isLoading, isError } = useAvgResponseTime();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(500);

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
    <Box
      className="relative flex flex-col overflow-hidden rounded-2xl"
      sx={{
        width: '100%',
        height: 230,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{content}</span>
    </Box>
  );

  if (isLoading) return stateUI(<span style={{ color: GREY, fontSize: 12 }}>Loading...</span>);
  if (isError)   return stateUI(<span style={{ color: RED, fontSize: 12 }}>{isError}</span>);

  const xLabels = data?.length > 0
    ? data.map((d: any) => d.crimeHour !== undefined ? `${d.crimeHour}:00` : '')
    : ['12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

  const pData = data?.length > 0
    ? data.map((d: any) => Number(d.avgMinutes) || 0)
    : [0, 0, 0, 0, 0, 0, 0];

  const totalAvg = pData.length > 0
    ? Math.round(pData.reduce((acc: number, val: number) => acc + val, 0) / pData.length)
    : 0;

  const maxVal = pData.length > 0 ? Math.max(...pData) : 0;
  const yMax   = maxVal > 0 ? Math.ceil(maxVal * 1.2) : 30;

  return (
    <Box
      className="relative flex flex-col w-full overflow-hidden rounded-2xl"
      sx={{
        height: 270,
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        padding: '16px 0px 0px 8px',
        boxSizing: 'border-box',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />

      {/* Header */}
      <div className="flex items-center justify-between w-full px-2 mb-1" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E05A5A]" />
          <span className="text-white font-medium text-[15px] tracking-wide">Hourly Response Analytics</span>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(88,113,125,0.15)' }}
        >
          <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold">AVG</span>
          <span className="text-xs font-bold text-white">{totalAvg}m</span>
        </div>
      </div>

      <div className="w-full h-px mb-2 ml-2"
        style={{ background: 'linear-gradient(90deg, rgba(88,113,125,0.2), transparent)' }} />

      <div ref={containerRef} className="flex justify-center flex-1 w-full">
        <LineChart
          series={[{
            data: pData,
            label: 'Avg Response Time (Min)',
            color: RED,
            curve: 'linear',
            showMark: true,
            valueFormatter: (v) => (v != null ? `${v} min` : ''),
          }]}
          xAxis={[{
            scaleType: 'point',
            data: xLabels,
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: GREY, fontSize: 10 },
          }]}
          yAxis={[{
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: GREY, fontSize: 11 },
            min: 0,
            max: yMax,
          }]}
          slots={{ mark: CustomMark }}
          slotProps={{ legend: { sx: { display: 'none' } } }}
          margin={{ top: 0, right: 30, bottom: 10, left: 0 }}
          sx={{
            zIndex: 1,
            '& .MuiChartsAxis-tickLabel tspan': { fill: '#94A3B8 !important', fontSize: '11px' },
            '& .MuiChartsAxis-line': { stroke: 'transparent' },
            '& .MuiChartsAxis-tick': { stroke: 'rgba(148,163,184,0.1)' },
          }}
          width={chartWidth || 500} 
          height={200}
        />
      </div>
    </Box>
  );
}