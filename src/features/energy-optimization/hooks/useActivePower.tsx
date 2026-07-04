import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTotalData } from "../../../shared/hooks/useTotalData";
import { useFlameSensor } from "../../fire-department/hooks/useFlame";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

///////////////LDR////////////////
export interface LDRData {
  sensor_id: string;
  ldr_value: number;
  status: string;
  power: number;
}

const fetchLDRValue = async (): Promise<LDRData> => {
  // Configured to handle raw numeric 'data' payload safely
  const res = await axios.get<{ status: string; data: number }>(
    `${BASE_URL}/api/v1/ldr/totalActiveLoad`
  );
  console.log(`The Power of the LDR:`, res.data.data);  
  
  return {
    sensor_id: 'LDR_TOTAL',
    ldr_value: res.data.data,
    status: 'NORMAL',
    power: res.data.data // Mapped raw response directly to power field
  };
};

/////////DHT11/////////
export interface DHT11Data {
  _id: string;
  temperature: number;
  humidity: number;
  status: string;
  power: number;
  timeStamp: string;
}

const fetchDHT11Value = async (): Promise<DHT11Data> => {
  const res = await axios.get<{ status: string; data: DHT11Data[] }>(
    `${BASE_URL}/api/v1/dht11/latest`
  );
  console.log(`The Power of the DHT:`, res.data.data[0].power);  

  return res.data.data[0] || { 
    _id: '',
    temperature: 0, 
    humidity: 0, 
    status: 'UNKNOWN', 
    power: 0,
    timeStamp: ''
  };
};

///////// MQ Interfaces ///////////////

export interface MQreading {
  sensor_id: string;
  type: string;
  power: number;
  co?: number;
  smoke?: string | number; 
  co2?: number;
  benzene?: string | number; 
  nh3?: number;
  alcohol?: number;
}

export interface AirQuality {
  aqi: number;
  level: string;
}

// 1. This represents the single object structure inside your array
export interface MQResponse {
  _id: string; // Changed from device_id to match your API payload
  sensors: MQreading[];
  air_quality: AirQuality;
  status: string;
  power: number; // This is the total device power (value: 2)
  timestamp: string;
}

export interface MQApiResponse {
  status: string;
  data: MQResponse[]; // This matches the array container from your endpoint
}

const fetchMQ135Value = async (): Promise<MQResponse> => {
  const res = await axios.get<MQApiResponse>(`${BASE_URL}/api/v1/mq135/latest`);
  console.log("the power of MQ",res.data.data[0].power);
  
  return res.data.data[0] || {
    _id: '',
    sensors: [],
    air_quality: { aqi: 0, level: 'UNKNOWN' },
    status: 'UNKNOWN',
    power: 0,
    timestamp: ''
  };
};


export const useActivePower = () => {
  // Removed useSensorPower() to resolve the infinite execution loop crash.
  
  // 1. FETCH LDR API
  const {
    data: LDRData,
    isLoading: isLDRLoading,
    isError: isLDRError,
  } = useQuery<LDRData>({
    queryKey: ['LDRValue'],
    queryFn: fetchLDRValue,
  });

  const LDRValue = LDRData?.ldr_value ?? 0;

  // 2. FETCH DHT11 API
  const {
    data: DHT11Value,
    isLoading: isDHT11Loading,
    isError: isDHT11Error,
  } = useQuery<DHT11Data>({
    queryKey: ['DHT11Value'],
    queryFn: fetchDHT11Value,
  });

  // 3. FETCH MQ135
  const {
    data: MQResponse,
    isLoading: isMQ135Loading,
    isError: isMQ135Error,
  } = useQuery<MQResponse>({
    queryKey: ['MQValue'],
    queryFn: fetchMQ135Value,
  });
  
  // 4. FETCH FLAME SENSOR (Available here if you want to add its power value later)
  const { flameSensorData} = useFlameSensor();

  // ─── CALCULATE COMBINED TOTAL LIVE ──────────────────────────────────────────
  const TotalPower = parseFloat(
    ((LDRData?.power ?? 0) + (DHT11Value?.power ?? 0) + (MQResponse?.power ?? 0) + (flameSensorData?.power ?? 0)).toFixed(2)
  );

  // ─── DYNAMIC PERCENTAGE GENERATOR ──────────────────────────────────────────
  const getPercent = (value: number = 0) => {
    if (TotalPower === 0) return 0;
    return parseFloat(((value / TotalPower) * 100).toFixed(1));
  };

  return {
    LDRData,
    LDRValue,
    DHT11Value,
    MQResponse,
    getPercent,
    TotalPower, // Now safely shared to the component
    isLoading: isLDRLoading || isDHT11Loading || isMQ135Loading,
    isError: isLDRError || isDHT11Error || isMQ135Error,
  };
};