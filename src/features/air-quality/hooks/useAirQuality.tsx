import { useQuery } from "@tanstack/react-query";
import { fetchAirQuality } from "../services/airQuality.api";

export function useAirQuality() {
  return useQuery({
    queryKey: ["air-quality"],
    queryFn: fetchAirQuality,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });
}