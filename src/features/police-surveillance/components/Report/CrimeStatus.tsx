import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';

const data = [
  { id: 0, value: 45, label: 'High', color: '#f06261' },
  { id: 1, value: 20, label: 'Medium', color: '#ffb338' },
  { id: 2, value: 10, label: 'Low', color: '#14B8A6' },
];

const StyledText = styled('text')(() => ({
  fill: '#94A3B8',
  textAnchor: 'middle',
  dominantBaseline: 'central',
}));

export default function CrimeStatus() {
  return (
    <PieChart
      series={[{ data, innerRadius: 50, outerRadius: 100, cx: 150, cy: 125, startAngle: -90, endAngle: 270 }]}
      width={300}
      height={250}
      slotProps={{ legend: { hidden: true } }}
    >
      <StyledText x={150} y={118} fontSize={22} fontWeight="bold">80</StyledText>
      <StyledText x={150} y={137} fontSize={10}>TOTAL</StyledText>
    </PieChart>
  );
}