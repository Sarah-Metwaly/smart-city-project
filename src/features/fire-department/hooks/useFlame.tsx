import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export interface FlameSensorData {
  _id: string;
  sensor_id: string; // Added to match standard sensor payloads
  status: string;
  risk_level: "DANGER" | "SAFE" | string;
  is_flame_detected: boolean;
  power?: number; // Kept optional in case GET omits it
  timeStamp: string;
}

interface ApiResponse {
  status: string;
  data: FlameSensorData[];
}

const fetchFlameSensor = async (): Promise<FlameSensorData[]> => {
  const res = await axios.get<ApiResponse>(`${BASE_URL}/api/v1/flame/latest`);
  console.log(res.data.data);
  
  return res.data.data;
};

export const useFlameSensor = () => {
  const { data, isLoading, isError, error } = useQuery<FlameSensorData[]>({
    queryKey: ["flameSensorStatus"],
    queryFn: fetchFlameSensor,
  });

  // Extract the latest reading safely
  const flameSensorData: FlameSensorData | null = data && data.length > 0 ? data[0] : null;

  return {
    flameSensorData,
    rawList: data ?? [],
    isFlameDetected: flameSensorData?.is_flame_detected ?? false,
    isLoading,
    isError,
    error: error as Error | null,
  };
};