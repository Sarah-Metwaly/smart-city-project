import humidityImg from './../../../assets/images/weather/carbon_humidity-alt.png';
import { HumidityIcon } from '../../../shared/icons/HumidityIcon';

interface HumidityProps {
  value: number;
}

const HumidityLevel = ({ value }: HumidityProps) => {  return (
    <div className="relative flex flex-col p-5 overflow-hidden bg-aman-dark rounded-2xl min-h-40 group">
      <p className="relative z-10 mb-1 text-xs font-medium text-aman-light">Humidity</p>
      <div className="absolute transition-opacity duration-500 right-25 top-6 opacity-40 group-hover:opacity-60">
        <img
          src={humidityImg}
          alt="Humidity Icon"
          className="object-contain w-16 h-16 " 
        />
      </div>

      <div className="flex items-center justify-between gap-6 mt-auto">
        <p className="text-aman-white font-bold text-[20px] leading-none">{value.toFixed(0)}%</p>
        <p className="flex items-center font-medium gap-1 mt-2 text-[12px] text-aman-gray">
           <span className="font-medium "><HumidityIcon size={16} className="blue-icon" /></span> The dew point is 27° right now
        </p>
      </div>
    </div>
  );
}

export default HumidityLevel;