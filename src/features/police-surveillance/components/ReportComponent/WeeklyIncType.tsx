import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useWeeklyTrend } from '../../hooks/useWeeklyTrend';

const GREY = '#9CA3AF';

function CustomMark(props: any) {
  const { x, y, color } = props;
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={color || '#E05A5A'} />
    </g>
  );
}

export default function WeeklyIncType() {
  const { data, isLoading, isError } = useWeeklyTrend();

  const renderStateUI = (content: React.ReactNode) => (
    <Box
      className="relative flex flex-col items-center justify-center w-full rounded-2xl"
      style={{
        height: 340,
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>{content}</div>
    </Box>
  );

  if (isLoading) return renderStateUI(<span style={{ color: GREY, fontSize: 12 }}>Loading...</span>);
  if (isError || !data?.length) return renderStateUI(<span style={{ color: '#E05A5A', fontSize: 12 }}>Failed to load data</span>);

  const WData = data.map((d: any) => Number(d.highPriority)  || 0);
  const BData = data.map((d: any) => Number(d.mediumPriority) || 0);
  const LData = data.map((d: any) => Number(d.lowPriority)   || 0);
  const totalIncidents = data.reduce((acc: number, d: any) => acc + (d.total || 0), 0);
  const xLabels = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

  const allValues = [...WData, ...BData, ...LData];
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 0;
  const yMax   = maxVal > 0 ? Math.ceil(maxVal * 1.2) : 15;

  return (
    <div
      className="relative flex flex-col w-full overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        height: 340,
        padding: '20px 0px 12px 0px',
        boxSizing: 'border-box',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />

      <div className="flex items-center justify-between w-full px-5 mb-3" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E05A5A]" />
          <span className="text-white font-medium text-[15px] tracking-wide">Weekly Incident Analysis</span>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(88,113,125,0.15)' }}
        >
          <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold">Total</span>
          <span className="text-xs font-bold text-white">{totalIncidents}</span>
        </div>
      </div>
      <div className="h-px mx-5 mb-4"
        style={{ background: 'linear-gradient(90deg, rgba(88,113,125,0.25), transparent)', position: 'relative', zIndex: 1 }} />

      <div className="relative flex-1 w-full min-h-0">
        <LineChart
          series={[
            { data: WData, label: 'Weapon',   color: '#E05A5A', curve: 'linear', showMark: true },
            { data: BData, label: 'Behavior', color: '#3B82F6', curve: 'linear', showMark: true },
            { data: LData, label: 'Fire',      color: '#14B8A6', curve: 'linear', showMark: true },
          ]}
          xAxis={[{
            scaleType: 'point',
            data: xLabels,
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: GREY, fontSize: 11, fontWeight: 500 },
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
          
          margin={{ top: 15, right: 40, bottom: 30, left: 0 }}
                    sx={{
            zIndex: 1,
            width: '100%',
            height: '100%',
            '& .MuiChartsAxis-tickLabel tspan': { fill: '#94A3B8 !important' },
            '& .MuiChartsWrapper-root': { width: '100%', height: '100%' }
          }}
        />
      </div>
    </div>
  );
}