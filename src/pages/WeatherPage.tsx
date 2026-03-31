import { useState, useEffect } from "react";
import { fetchWeatherFullData, fetchAirQuality } from "../features/env-monitoring/services/weatherService";
import CurrentWeather from "../features/env-monitoring/components/CurrentWeather";
import VisibilityStatus from "../features/env-monitoring/components/VisibilityStatus";
import UVIndexLevel from "./../features/env-monitoring/components/UVIndexLevel";
import HumidityLevel from "./../features/env-monitoring/components/HumidityLevel";
import AirQualityStats from "./../features/env-monitoring/components/AirQualityStats";
import WindStatus from "../features/env-monitoring/components/WindStatus";
import WeeklyWeatherForecast from "../features/env-monitoring/components/WeeklyWeatherForecast";

const WeatherPage = () => {
  const [data, setData] = useState<any>(null);
  const [airData, setAirData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const lat = 30.0444;
  const lon = 31.2357;

  const fetchData = () => {
    Promise.all([fetchWeatherFullData(lat, lon), fetchAirQuality(lat, lon)])
      .then(([weather, air]) => {
        setData(weather);
        setAirData(air);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  fetchData();
// call the api every 5 minets
  const interval = setInterval(fetchData, 300000); 

  return () => clearInterval(interval);
}, []);

  if (loading) return <div className="min-h-screen bg-aman-black" />;

  return (
    <div className="lg:h-screen  w-full  bg-linear-to-b from-aman-black to-aman-gray  md:p-23 flex flex-col">
      
      <div className="grid h-full grid-cols-1 gap-5 mx-auto lg:grid-cols-12 max-w-350">

        {/* LEFT SECTION */}
        <div className="flex flex-col gap-4 lg:col-span-6 lg:h-full">
          <div className="h-auto lg:flex-4 lg:min-h-0">
            <CurrentWeather
              temp={data.current.temperature_2m}
              feelsLike={data.current.apparent_temperature}
              code={data.current.weather_code}
            />
          </div>
          <div className="h-auto lg:flex-5 lg:min-h-0">
            <WeeklyWeatherForecast
              hourly={data.hourly}
              tomorrow={data.daily}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col gap-4 lg:col-span-6 lg:h-full">
          
          <div className="grid grid-cols-2 gap-3 lg:flex-6 h-fit lg:min-h-0">
            <WindStatus speed={data.current.wind_speed_10m} />
            <UVIndexLevel value={data.current.uv_index} />
            <HumidityLevel value={data.current.relative_humidity_2m} />
            <VisibilityStatus value={data.current.visibility / 1000} />
          </div>

          <div className="h-auto pb-6 lg:flex-4 lg:min-h-0 lg:pb-0">
            <AirQualityStats
              co2={airData.current.carbon_monoxide}
              no2={airData.current.nitrogen_dioxide}
              nh3={airData.current.ammonia}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherPage;