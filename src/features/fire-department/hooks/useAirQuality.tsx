// hooks/useAirQuality.ts
import { useQuery } from "@tanstack/react-query";

export interface SensorData {
  mq135: number;
  pressure: number;
  altitude: number;
  humidity : number;
  aqi: number;
  co: number;
  co2: number;
  smoke: "High" | "Moderate" | "Normal";
  nh3: "High" | "Moderate" | "Normal";
}

const STATIC_DATA: SensorData = {
  mq135: 8.4,
  pressure: 1013,
  altitude: 142,
  humidity :120,
  aqi: 147,
  co: 8.4,
  co2: 1240,
  smoke: "High",
  nh3: "Normal",
};

async function fetchAirQuality(): Promise<SensorData> {
  // ── Replace with real endpoint ─────────────────────────────────────────
  // const res = await fetch("/api/air-quality");
  // if (!res.ok) throw new Error("Failed to fetch air quality data");
  // return res.json();
  return STATIC_DATA;
}

export function useAirQuality() {
  return useQuery({
    queryKey: ["air-quality"],
    queryFn: fetchAirQuality,
    refetchInterval: 5000,
  });
}