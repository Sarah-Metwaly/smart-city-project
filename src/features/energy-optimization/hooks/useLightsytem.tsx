import { useQuery } from '@tanstack/react-query';

export interface LdrReading {
  sensor_id: string;
  status: 'ON' | 'OFF' | 'FAULTY';
  power?: number;
}

export const useLightSystem = () => {
  const { data } = useQuery<LdrReading>({
    queryKey: ['LDRValue'],
    queryFn: () => Promise.reject(new Error('LDRValue is WS-only')),
    enabled: false, // never fetch — populated only by the WS handler
    staleTime: Infinity,
    retry: false,
  });

  const isLightsOn = data?.status === 'ON';
  const isFaulty = data?.status === 'FAULTY';
  const hasData = !!data;

  return {
    reading: data,
    isLightsOn,
    isFaulty,
    hasData,
  };
};