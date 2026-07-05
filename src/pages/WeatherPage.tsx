import { useState, useEffect } from "react";
import { fetchWeatherFullData, fetchAirQuality } from "../features/env-monitoring/services/weatherService";
import CurrentWeather from "../features/env-monitoring/components/CurrentWeather";
import VisibilityStatus from "../features/env-monitoring/components/VisibilityStatus";
import UVIndexLevel from "./../features/env-monitoring/components/UVIndexLevel";
import HumidityLevel from "./../features/env-monitoring/components/HumidityLevel";
import WindStatus from "../features/env-monitoring/components/WindStatus";
import WeeklyWeatherForecast from "../features/env-monitoring/components/WeeklyWeatherForecast";
import AirQuality from '../features/air-quality/components/AirQuality';

const WeatherPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lat = 30.0444;
    const lon = 31.2357;

    const fetchData = () => {
      fetchWeatherFullData(lat, lon)
        .then((weather) => {
          setData(weather);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    };

    fetchData();
    // call the api every 5 minutes
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="min-h-screen bg-aman-black" />;

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-aman-black to-aman-gray p-4 sm:p-6 md:p-10 lg:p-16 flex flex-col">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 mx-auto lg:grid-cols-12 max-w-350 w-full items-stretch">

        {/* LEFT SECTION */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-6">
          <div className="h-auto">
            <CurrentWeather
              temp={data.current.temperature_2m}
              feelsLike={data.current.apparent_temperature}
              code={data.current.weather_code}
            />
          </div>
          <div className="flex-1">
            <WeeklyWeatherForecast
              hourly={data.hourly}
              tomorrow={data.daily}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
            <WindStatus speed={data.current.wind_speed_10m} />
            <UVIndexLevel value={data.current.uv_index} />
            <HumidityLevel value={data.current.relative_humidity_2m} />
            <VisibilityStatus value={data.current.visibility / 1000} />
          </div>
        </div>

        {/* AIR QUALITY — full-width row underneath both columns */}
        <div className="lg:col-span-12">
          <AirQuality />
        </div>

      </div>
    </div>
  );
};

export default WeatherPage;