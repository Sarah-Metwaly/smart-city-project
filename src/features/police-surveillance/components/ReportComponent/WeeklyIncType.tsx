import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useWeeklyTrend } from '../../hooks/useWeeklyTrend';

const GREY = '#9CA3AF';

function CustomMark(props: any) {
  const { x, y, color } = props;
  return <circle cx={x} cy={y} r={5} fill={color || '#E05A5A'} />;
}

export default function WeeklyIncType() {
  const { data, isLoading, isError } = useWeeklyTrend();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data.length) return <div>Failed to load data</div>;

  // البيانات من الـ API
  const WData = data.map(d => d.highPriority);
  const BData = data.map(d => d.mediumPriority);
  const LData = data.map(d => d.lowPriority);

  // labels ثابتة
  const xLabels = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <LineChart
        series={[
          { data: WData, label: 'Weapon', color: '#E05A5A', curve: 'linear' },
          { data: BData, label: 'Behavior', color: '#3B82F6', curve: 'linear' },
          { data: LData, label: 'Fire', color: '#14B8A6', curve: 'linear' },
        ]}
        xAxis={[{
          scaleType: 'point',
          data: xLabels,
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { fill: GREY, fontSize: 11 },
        }]}
        yAxis={[{
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { fill: GREY, fontSize: 11 },
        }]}
        slots={{ mark: CustomMark }}
        sx={{
          '& .MuiChartsLegend-label': { fill: GREY, fontSize: 12 },
          '& .MuiChartsAxis-tickLabel': { fill: GREY },
        }}
        height={300}
      />
    </Box>
  );
}
