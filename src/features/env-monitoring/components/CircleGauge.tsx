import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

interface GaugeProps {
  label: string;
  percent: number;
}

const CircleGauge = ({ label, percent }: GaugeProps) => {
  return (
    <div className="flex flex-col items-center ">
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="amanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58717D" />
            <stop offset="100%" stopColor="#182B31" />
          </linearGradient>
        </defs>
      </svg>

      <p className="text-[14px] font-medium text-aman-white uppercase tracking-tighter">
        {label}
      </p>
      
      <div className="relative w-20 h-20 lg:w-24 lg:h-24">
        <Gauge
          value={percent}
          innerRadius="82%"
          outerRadius="100%"
          sx={{
            [`& .${gaugeClasses.valueArc}`]: { fill: 'url(#amanGradient)' },
            [`& .${gaugeClasses.referenceArc}`]: { fill: '#e5e5e6', opacity: 0.2 }, 
            [`& .${gaugeClasses.valueText}`]: { display: 'none' },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-aman-light text-[7px] uppercase">status</span>
          <span className="text-xs font-bold text-white">{Math.round(percent)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CircleGauge;