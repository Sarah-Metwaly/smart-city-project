import { useLightSystem } from './useLightsytem';
import { useAirQuality } from '../../air-quality/hooks/useAirQuality';
import { useFlameSensor } from '../../fire-department/hooks/useFlame';

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