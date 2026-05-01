import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const WData = [12, 18, 15, 25, 20, 28, 22];
const BData = [20, 4, 5, 6, 7, 8, 9];
const FData = [40, 10, 30, 25, 30, 28];

const xLabels = ['SUN', 'MON', 'TUE', 'THU', 'WED', 'FRI', 'SAT'];

const GREY = '#9CA3AF';

function CustomMark(props: any) {
  const { x, y, color } = props;
  return (
    <g>
      <circle cx={x} cy={y} r={5} fill={color || '#E05A5A'} />
    </g>
  );
}

export default function WeeklyType() {
  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <LineChart
        series={[
          { data: WData, label: 'Weapon', color: '#E05A5A', curve: 'linear' },
          { data: BData, label: 'Behavior', color: '#3B82F6', curve: 'linear' },
          { data: FData, label: 'Fire', color: '#14B8A6', curve: 'linear' },
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
        slotProps={{
          legend: {
            labelStyle: { fill: GREY, fontSize: 12 },
          },
        }}
        sx={{
          '& .MuiChartsLegend-label': { fill: GREY },
          '& .MuiChartsAxis-tickLabel': { fill: GREY },
          
        }}
        height={200}
      />
    </Box>
  );
}