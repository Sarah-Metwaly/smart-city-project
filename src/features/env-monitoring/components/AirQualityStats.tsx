import CircleGauge from "./CircleGauge";

interface AirProps {
  co2: number;
  no2: number;
  nh3: number;
}

const AirQualityStats = ({ co2, no2, nh3 }: AirProps) => {
  const calculatePercent = (val: number, max: number) => Math.min(100, (val / max) * 100);

  return (
    <div className="px-4 pt-2 bg-aman-dark rounded-3xl min-h-40">
      <p className="text-aman-white font-bold text-[16px] tracking-widest mb-4 uppercase opacity-80">
        Air Quality
      </p>
      <div className="flex items-center justify-around gap-2">
        <CircleGauge label="CO2" percent={calculatePercent(co2, 1000)} />
        <CircleGauge label="Co" percent={calculatePercent(no2, 100)} />
        <CircleGauge label="Benzene" percent={calculatePercent(nh3, 50)} />
      </div>
    </div>
  );
}

export default AirQualityStats;