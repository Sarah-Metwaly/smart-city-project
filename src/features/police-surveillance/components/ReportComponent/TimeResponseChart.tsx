import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useAvgResponseTime } from '../../../../features/police-surveillance/hooks/useAvgResponseTime';

const GREY = '#9CA3AF';
const RED = '#E05A5A';

function CustomMark(props: any) {
  const { x, y, color, ...other } = props;
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={RED} {...other} />
    </g>
  );
}

export default function TimeResponseChart() {
  const { data, isLoading, isError } = useAvgResponseTime();

  if (isLoading)
    return (
      <Box
        className="relative flex flex-col overflow-hidden rounded-2xl"
        sx={{
          width: '100%',
          height: 230,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
          boxShadow:
            '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)',
          }}
        />
        <span
          style={{ color: GREY, fontSize: 12, position: 'relative', zIndex: 1 }}
        >
          Loading...
        </span>
      </Box>
    );

  if (isError)
    return (
      <Box
        className="relative flex flex-col overflow-hidden rounded-2xl"
        sx={{
          width: '100%',
          height: 230,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
          boxShadow:
            '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)',
          }}
        />
        <span
          style={{
            color: '#E05A5A',
            fontSize: 12,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isError}
        </span>
      </Box>
    );

  const xLabels =
    data && data.length > 0
      ? data.map((d: any) =>
          d.crimeHour !== undefined ? `${d.crimeHour}:00` : '',
        )
      : ['12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

  const pData =
    data && data.length > 0
      ? data.map((d: any) => Number(d.avgMinutes) || 0)
      : [0, 0, 0, 0, 0, 0, 0];

  const totalAvg =
    pData.length > 0
      ? Math.round(
          pData.reduce((acc: number, val: number) => acc + val, 0) /
            pData.length,
        )
      : 0;

  const maxVal = pData.length > 0 ? Math.max(...pData) : 0;
  const yMax = maxVal > 0 ? Math.ceil(maxVal * 1.2) : 30;

  return (
    <Box
      className="relative flex flex-col h-[270px] w-full overflow-hidden rounded-2xl"
      sx={{
        background:
          'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow:
          '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
        padding: '16px 0px 0px 8px',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)',
        }}
      />

      <div
        className="flex items-center justify-between w-full mb-1"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E05A5A]" />
          <span className="text-white font-medium text-[15px] tracking-wide">
            Hourly Response Analytics
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-0.5 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(88,113,125,0.15)',
          }}
        >
          <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold">
            AVG
          </span>
          <span className="text-xs font-bold text-white">{totalAvg}m</span>
        </div>
      </div>

      <div
        className="w-full h-px mb-2"
        style={{
          background:
            'linear-gradient(90deg, rgba(88,113,125,0.2), transparent)',
          marginLeft: '8px',
        }}
      />

      <div className="flex justify-center w-full">
        <LineChart
          series={[
            {
              data: pData,
              label: 'Avg Response Time (Min)',
              color: RED,
              curve: 'linear',
              showMark: true,
              valueFormatter: (v) => (v != null ? `${v} min` : ''),
            },
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: { fill: GREY, fontSize: 10 },
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: { fill: GREY, fontSize: 11 },
              min: 0,
              max: yMax,
            },
          ]}
          slots={{ mark: CustomMark }}
          slotProps={{
            legend: { sx: { display: 'none' } },
          }}
          margin={{ top: 0, right: 30, bottom: 10, left: 0 }}
          sx={{
            zIndex: 1,
            '& .MuiChartsAxis-tickLabel tspan': {
              fill: '#94A3B8 !important',
              fontSize: '11px',
            },
            '& .MuiChartsAxis-line': {
              stroke: 'transparent',
            },
            '& .MuiChartsAxis-tick': {
              stroke: 'rgba(148, 163, 184, 0.1)',
            },
          }}
          width={500}
          height={200}
        />
      </div>
    </Box>
  );
}
