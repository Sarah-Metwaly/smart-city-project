import { LocationIcon } from "../../../shared/icons/LocationIcon";
import cloudImg from "./../../../assets/images/weather/sun-cloud.png";
import grayCloudImg from "./../../../assets/images/weather/cloud_svgrepo.com.png";

interface CurrentWeatherProps {
  temp: number;
  feelsLike: number;
  code: number;
}

const CurrentWeather = ({ temp, feelsLike, code }: CurrentWeatherProps) => {
  const now = new Date();
  const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now);
  const fullDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(now);

  const getWeatherDesc = (c: number) => {
    if (c === 0) return "Clear Sky";
    if (c <= 3) return "Partly Cloudy";
    if (c >= 51 && c <= 67) return "Rainy";
    return "Cloudy";
  };

  return (
    <div className="relative flex flex-col h-full p-5 overflow-hidden bg-aman-dark rounded-4xl">
      {/* City badge */}
      <div className="flex items-center gap-1 px-2.5 py-0.5 mb-3 rounded-full w-fit bg-white/10 backdrop-blur-md">
        <LocationIcon size={8} className="text-white/80" />
        <span className="text-[9px] font-medium text-white/80">Cairo</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-white text-[32px] font-bold leading-tight">{dayName}</h2>
          <p className="text-[10px] font-medium text-aman-light">{fullDate}</p>
        </div>
        <div className="mt-auto">
          <h1 className="text-white text-[52px] font-bold leading-none tracking-tighter">
            {Math.round(temp)}°C
          </h1>
          <p className="mt-1 text-[10px] text-aman-light font-medium">
            High: {Math.round(temp + 2)}° &nbsp; Low: {Math.round(temp - 3)}°
          </p>
        </div>
      </div>

      {/* Weather icon + condition */}
      <div className="absolute flex flex-col items-center top-4 right-2">
        <div className="w-36 h-28">
          <img src={cloudImg} alt="Weather Status" className="object-contain w-full h-full drop-shadow-2xl" />
        </div>
        <div className="flex flex-col items-center mt-2">
          <p className="text-base font-bold leading-none text-white">{getWeatherDesc(code)}</p>
          <p className="mt-1 text-[10px] text-aman-blue">Feels Like {Math.round(feelsLike)}°</p>
        </div>
      </div>

      {/* Decorative cloud */}
      <div className="absolute bottom-2 left-[45%] opacity-50">
        <img src={grayCloudImg} alt="Decor" className="object-contain w-6 h-6" />
      </div>
    </div>
  );
};

export default CurrentWeather;