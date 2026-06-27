import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useAvgResponseTime } from '../../../../features/police-surveillance/hooks/useAvgResponseTime'; // Hook بتاع الـ Response Time

const GREY = '#9CA3AF';

function CustomMark(props: any) {
  const { x, y, color, ...other } = props;
  return (
    <g>
      <circle cx={x} cy={y} r={5} fill={color || '#E05A5A'} {...other} />
    </g>
  );
}

export default function TimeResponseChart() {
  const { data, isLoading, isError } = useAvgResponseTime(); // Hook بتاع الـ Response Time

  if (isLoading)
    return (
      <Box
        sx={{
          width: '100%',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: GREY, fontSize: 12 }}>Loading...</span>
      </Box>
    );

  if (isError)
    return (
      <Box
        sx={{
          width: '100%',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#E05A5A', fontSize: 12 }}>{isError}</span>
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
      ? data.map((d: any) => d.avgMinutes ?? 0)
      : [0, 0, 0, 0, 0, 0, 0];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 220,
        p: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LineChart
        series={[
          {
            data: pData,
            label: 'Avg Response Time (Min)',
            color: '#E05A5A',
            curve: 'linear',
            showMark: true,
          },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: xLabels,
            disableLine: false,
            disableTicks: false,
            tickLabelStyle: { fill: GREY, fontSize: 10 },
          },
        ]}
        yAxis={[
          {
            disableLine: false,
            disableTicks: false,
            tickLabelStyle: { fill: GREY, fontSize: 10 },
          },
        ]}
        slots={{ mark: CustomMark }}
        sx={{
          margin: { top: 40, right: 20, bottom: 40, left: 40 },
          '& .MuiChartsLegend-label': { fill: GREY, fontSize: '11px' },
          '& .MuiChartsAxis-tickLabel': { fill: GREY },
        }}
        width={400}
        height={220}
      />
    </Box>
  );
}
