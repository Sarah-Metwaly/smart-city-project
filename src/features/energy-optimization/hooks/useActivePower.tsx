// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useFlameSensor } from "../../fire-department/hooks/useFlame";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ─── LDR ─────────────────────────────────────────────────────────────────
// export interface LDRData {
//   sensor_id: string;
//   ldr_value: number;
//   status: string;
//   power: number;
// }

// const fetchLDRValue = async (): Promise<LDRData> => {
//   const res = await axios.get<{ status: string; data: number }>(
//     `${BASE_URL}/api/v1/ldr/totalActiveLoad`
//   );

//   return {
//     sensor_id: 'LDR_TOTAL',
//     ldr_value: res.data.data,
//     status: 'NORMAL',
//     power: res.data.data,
//   };
// };

// // ─── DHT11 ───────────────────────────────────────────────────────────────
// export interface DHT11Data {
//   _id: string;
//   temperature: number;
//   humidity: number;
//   status: string;
//   power: number;
//   timeStamp: string;
// }

// const DEFAULT_DHT11: DHT11Data = {
//   _id: '',
//   temperature: 0,
//   humidity: 0,
//   status: 'UNKNOWN',
//   power: 0,
//   timeStamp: '',
// };

// const fetchDHT11Value = async (): Promise<DHT11Data> => {
//   const res = await axios.get<{ status: string; data: DHT11Data[] }>(
//     `${BASE_URL}/api/v1/dht11/latest`
//   );

//   return res.data.data[0] || DEFAULT_DHT11;
// };

// // ─── MQ135 ───────────────────────────────────────────────────────────────
// export interface MQreading {
//   sensor_id: string;
//   type: string;
//   power: number;
//   co?: number;
//   smoke?: string | number;
//   co2?: number;
//   benzene?: string | number;
//   nh3?: number;
//   alcohol?: number;
// }

// export interface AirQuality {
//   aqi: number;
//   level: string;
// }

// export interface MQResponse {
//   _id: string;
//   sensors: MQreading[];
//   air_quality: AirQuality;
//   status: string;
//   power: number;
//   timestamp: string;
// }

// export interface MQApiResponse {
//   status: string;
//   data: MQResponse[];
// }

// const DEFAULT_MQ: MQResponse = {
//   _id: '',
//   sensors: [],
//   air_quality: { aqi: 0, level: 'UNKNOWN' },
//   status: 'UNKNOWN',
//   power: 0,
//   timestamp: '',
// };

// const fetchMQ135Value = async (): Promise<MQResponse> => {
//   const res = await axios.get<MQApiResponse>(`${BASE_URL}/api/v1/mq135/latest`);
//   return res.data.data[0] || DEFAULT_MQ;
// };

// // ─── Hook ────────────────────────────────────────────────────────────────
// export const useActivePower = () => {
//   const {
//     data: LDRData,
//     isLoading: isLDRLoading,
//     isError: isLDRError,
//   } = useQuery<LDRData>({
//     queryKey: ['LDRValue'],
//     queryFn: fetchLDRValue,
//   });

//   const LDRValue = LDRData?.ldr_value ?? 0;

//   const {
//     data: DHT11Value,
//     isLoading: isDHT11Loading,
//     isError: isDHT11Error,
//   } = useQuery<DHT11Data>({
//     queryKey: ['DHT11Value'],
//     queryFn: fetchDHT11Value,
//   });

//   const {
//     data: MQResponse,
//     isLoading: isMQ135Loading,
//     isError: isMQ135Error,
//   } = useQuery<MQResponse>({
//     queryKey: ['MQValue'],
//     queryFn: fetchMQ135Value,
//   });

//   const { flameSensorData } = useFlameSensor();

//   const TotalPower = parseFloat(
//     (
//       (LDRData?.power ?? 0) +
//       (DHT11Value?.power ?? 0) +
//       (MQResponse?.power ?? 0) +
//       (flameSensorData?.power ?? 0)
//     ).toFixed(2)
//   );

//   const getPercent = (value: number = 0) => {
//     if (TotalPower === 0) return 0;
//     return parseFloat(((value / TotalPower) * 100).toFixed(1));
//   };

//   return {
//     LDRData,
//     LDRValue,
//     DHT11Value,
//     MQResponse,
//     getPercent,
//     TotalPower,
//     isLoading: isLDRLoading || isDHT11Loading || isMQ135Loading,
//     isError: isLDRError || isDHT11Error || isMQ135Error,
//   };
// };
import { useLightSystem } from './useLightsytem';
import { useAirQuality } from '../../air-quality/hooks/useAirQuality';
import { useFlameSensor } from '../../fire-department/hooks/useFlame';

// ─── Light System (LDR) ────────────────────────────────────────────────────
export interface LDRReading {
  sensor_id: string;
  ldr_value: number;
  status: string;
  power: number;
}

// ─── DHT11 ─────────────────────────────────────────────────────────────────
export interface DHT11Data {
  _id: string;
  temperature: number;
  humidity: number;
  status: string;
  power: number;
  timeStamp: string;
}

// ─── MQ135 ─────────────────────────────────────────────────────────────────
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

export interface MQResponseData {
  _id: string;
  sensors: MQreading[];
  air_quality: AirQuality;
  status: string;
  power: number;
  timestamp: string;
}

// ─── Combined Air Quality Hook Response ────────────────────────────────────
export interface AirQualityData {
  dht11: DHT11Data;
  mq135: MQResponseData;
}

// ─── Flame ──────────────────────────────────────────────────────────────────
export interface FlameSensorData {
  _id: string;
  status: string;
  risk_level: "DANGER" | "SAFE" | "WARNING" | string;
  is_flame_detected: boolean;
  power: number;
  timeStamp: string;
}

export const useActivePower = () => {
  const { reading: LDRData, isLoading: isLDRLoading } = useLightSystem();
  const { data: airQualityData, isLoading: isAQLoading, isError: isAQError } = useAirQuality();
  const { flameSensorData, isLoading: isFlameLoading } = useFlameSensor();

  const LDRValue = LDRData?.power ?? 0;
  const DHT11Value = airQualityData?.dht11;
  const MQResponse = airQualityData?.mq135;

  const TotalPower = parseFloat(
    (
      (LDRData?.power ?? 0) +
      (DHT11Value?.power ?? 0) +
      (MQResponse?.power ?? 0) +
      (flameSensorData?.power ?? 0)
    ).toFixed(2)
  );

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
    TotalPower,
    isLoading: isLDRLoading || isAQLoading || isFlameLoading,
    isError: isAQError,   // only useAirQuality does a real fetch that can fail
  };
};