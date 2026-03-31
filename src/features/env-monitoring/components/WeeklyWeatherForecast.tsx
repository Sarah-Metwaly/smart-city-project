import ForecastHourCard from "./ForecastHourCard";
import sunCloudImg from "../../../assets/images/weather/Sun.png";
import stormImg from "../../../assets/images/weather/storm.gif";

interface ForecastProps {
  hourly: { time: string[]; temperature_2m: number[] };
  tomorrow: { temperature_2m_max: number[]; sunrise: string[]; sunset: string[] };
}

const WeeklyWeatherForecast = ({ hourly, tomorrow }: ForecastProps) => {
  const nextHours = hourly.time.slice(0, 7).map((t, i) => ({
    time: new Date(t).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
    temp: Math.round(hourly.temperature_2m[i]),
    icon: sunCloudImg,
  }));

  const sunrise = new Date(tomorrow.sunrise[0]);
  const sunset  = new Date(tomorrow.sunset[0]);
  const diff    = sunset.getTime() - sunrise.getTime();
  const hLen    = Math.floor(diff / (1000 * 60 * 60));
  const mLen    = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex flex-row max-lg:flex-col w-full gap-3 p-3 bg-aman-dark rounded-3xl min-h-55 max-lg:min-h-fit">

      {/* ── LEFT SECTION ── */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
        <div className="flex items-center gap-1 h-fit">
          <button className="text-[11px] font-bold text-aman-white">Today /</button>
          <button className="text-[11px] font-bold text-aman-white opacity-60">Week</button>
        </div>

        <div className="bg-linear-to-r from-[#0E1421] via-aman-teal to-[#0E1421] p-1.5 rounded-2xl flex justify-between items-center h-fit overflow-x-auto no-scrollbar">
          {nextHours.map((h, i) => (
            <ForecastHourCard key={i} time={h.time} temp={h.temp} icon={h.icon} />
          ))}
        </div>

        <div className="flex items-center justify-between px-4 h-14 rounded-2xl bg-linear-to-r from-[#0E1421] via-aman-teal to-[#0E1421] relative">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold leading-tight text-white">Tomorrow</span>
              <span className="text-[8px] text-gray-400">Thunder storm</span>
            </div>
            <span className="text-xl font-bold text-white">
              {Math.round(tomorrow.temperature_2m_max[1])}°
            </span>
          </div>
          <div className="relative shrink-0 h-full w-14">
            <img
              src={stormImg}
              alt="Storm"
              className="absolute right-0 object-contain scale-125 w-14 h-14 -top-6 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1E3A44] rounded-2xl flex flex-col max-lg:flex-row justify-around max-lg:justify-between items-start max-lg:items-center px-3 py-2 max-lg:px-4 max-lg:py-3 min-w-26.25 max-lg:w-full shrink-0 gap-2">
        <div className="flex flex-col max-lg:flex-row items-start max-lg:items-center gap-0.5 max-lg:gap-2">
          <p className="text-[#656a72] text-[8px] font-bold uppercase">Sunrise</p>
          <p className="text-sm font-bold leading-none text-white max-lg:text-xs">
            {sunrise.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>

        <div className="flex flex-col max-lg:flex-row items-start max-lg:items-center gap-0.5 max-lg:gap-2">
          <p className="text-[#656a72] text-[8px] font-bold uppercase">Sunset</p>
          <p className="text-sm font-bold leading-none text-white max-lg:text-xs">
            {sunset.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>

        <div className="flex flex-col max-lg:flex-row items-start max-lg:items-center gap-0.5 max-lg:gap-2">
          <p className="text-[#656a72] text-[8px] font-bold uppercase">Length</p>
          <p className="text-[11px] max-lg:text-[10px] font-bold text-white">
            {hLen}h {mLen}m
          </p>
        </div>
      </div>

    </div>
  );
};

export default WeeklyWeatherForecast;