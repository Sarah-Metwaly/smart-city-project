import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface FlameSensorData {
  _id: string;
  sensor_id: string; 
  status: string;
  risk_level: "DANGER" | "SAFE" | string;
  is_flame_detected: boolean;
  power: number; // Changed to required to match your active power calculations
  timeStamp: string;
}

interface ApiResponse {
  status: string;
  data: FlameSensorData[];
}

// 1. Updated type from FlameSensorData[] to FlameSensorData
const fetchFlameSensor = async (): Promise<FlameSensorData> => {
  const res = await axios.get<ApiResponse>(`${BASE_URL}/api/v1/flame/latest`);
  console.log("power of flame ", res.data.data[0]?.power);
  
  return res.data.data[0] || {
    _id: '',
    sensor_id: 'FLAME_01',
    status: 'UNKNOWN',
    risk_level: 'SAFE',
    is_flame_detected: false,
    power: 0,
    timeStamp: ''
  };
};

export const useFlameSensor = () => {
  const { data: flameSensorData, isLoading, isError, error } = useQuery<FlameSensorData>({
    queryKey: ["flameSensorStatus"],
    queryFn: fetchFlameSensor,
  });

  return {
    flameSensorData,
    isFlameDetected: flameSensorData?.is_flame_detected ?? false,
    isLoading,
    isError,
    error: error as Error | null,
  };
};