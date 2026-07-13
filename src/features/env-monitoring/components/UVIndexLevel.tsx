import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

interface UVProps {
  value: number;
}

const UVIndexLevel = ({ value }: UVProps) => {
  const uvValue = value || 0; 
  const maxUV = 12;

  return (
    <div className="flex flex-col items-center p-4 bg-aman-dark rounded-2xl min-h-40">
      <p className="self-start text-[12px] font-medium text-white/70 tracking-wide mb-1 ">
        UV Index
      </p>
      <svg style={{ height: 0, width: 0, position: "absolute" }}>
        <defs>
          <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5E7A82" />
            <stop offset="100%" stopColor="#415B63" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative flex justify-center w-full h-20 mt-1">
        <Gauge
          value={uvValue}
          valueMax={maxUV}
          startAngle={-90}
          endAngle={90}
          innerRadius="75%"
          outerRadius="100%"
          sx={{
            [`& .${gaugeClasses.valueArc}`]: {
              fill: "url(#uvGradient)",
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: "#bad4eb",
              opacity: 0.2,
            },
            [`& .${gaugeClasses.root}`]: {
              strokeLinecap: "butt",
            },
          }}
          text={""}
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <span className="absolute top-5.5 right-[49%] text-[12px] text-white/40 font-bold">5</span>
            <span className="absolute top-6 right-[42%] text-[12px] text-white/40 font-bold">7</span>
            <span className="absolute bottom-5.75 right-[36%] text-[12px] text-white/40 font-bold">10</span>
            <span className="absolute bottom-1.25 right-[32%] text-[12px] text-white/40 font-bold">12</span>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 ">
        <span className="text-2xl font-bold tracking-tight text-aman-white">
          {uvValue.toFixed(2)}
        </span>
        <span className="text-xs font-bold uppercase text-aman-light opacity-90">
          UV
        </span>
      </div>
    </div>
  );
};

export default UVIndexLevel;