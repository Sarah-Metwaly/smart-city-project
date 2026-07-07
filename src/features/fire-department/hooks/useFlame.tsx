import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface FlameSensorData {
  _id: string;
  status: string;
  risk_level: "DANGER" | "SAFE" | string;
  is_flame_detected: boolean;
  power: number;
  timeStamp: string;
}

const fetchInitialFlameReading = async (): Promise<FlameSensorData> => {
  const res = await axios.get(`${BASE_URL}/api/v1/flame/latest`);
  return res.data?.data?.[0] ?? {
    _id: '',
    status: 'UNKNOWN',
    risk_level: 'SAFE',
    is_flame_detected: false,
    power: 0,
    timeStamp: '',
  };
};

export const useFlameSensor = () => {
  const { data: flameSensorData, isLoading, isError } = useQuery<FlameSensorData>({
    queryKey: ["flameSensorStatus"],
    queryFn: fetchInitialFlameReading,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // risk_level is now the single source of truth for "is this dangerous?"
  const isFlameDetected = flameSensorData?.risk_level === 'DANGER';

  return {
    flameSensorData,
    isFlameDetected,
    isLoading,
    isError,
  };
};