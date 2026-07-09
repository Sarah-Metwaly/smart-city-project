import { PieChart } from '@mui/x-charts/PieChart';

interface ChartProps {
  value: number;
  label?: string;
  mainColor?: string;
  secondColor?:string;
}

const Chart = ({ value, label, mainColor,secondColor='#182B31' }: ChartProps) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <PieChart
        series={[
          {
            data: [
              { value: value, color: mainColor },
              { value: 100 - value, color: secondColor },
            ],
            innerRadius: 45,
            outerRadius: 55,
            paddingAngle: 0,
          },
        ]}
        width={150}
        height={150}
        hideLegend
      />

      <div className='absolute inset-0 flex items-center justify-center text-aman-white font-inter  pointer-events-none'>
  {label || `${value}%`}
</div>
    </div>
  );
}
export default Chart;