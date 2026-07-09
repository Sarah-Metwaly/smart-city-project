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