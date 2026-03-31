const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeatherFullData = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index,visibility",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "2"
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("Weather data fetch failed");
  return await response.json();
};

export const fetchAirQuality = async (lat: number, lon: number) => {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=carbon_monoxide,nitrogen_dioxide,ammonia&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Air quality fetch failed");
  return await response.json();
};