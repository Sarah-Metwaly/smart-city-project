import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LdrReading {
  sensor_id: string;
  status: 'ON' | 'OFF' | 'FAULTY';
  power?: number;
}

const fetchInitialLdrReading = async (): Promise<LdrReading> => {
  const res = await axios.get(`${BASE_URL}/api/v1/ldr/status`);
  const list = res.data?.data;
  const reading = Array.isArray(list) ? list[0] : list;
  return reading ?? { sensor_id: '', status: 'OFF', power: 0 };
};

export const useLightSystem = () => {
  const { data, isLoading, isError } = useQuery<LdrReading>({
    queryKey: ['LDRValue'],
    queryFn: fetchInitialLdrReading,  // seeds the cache once, on mount/refresh
    staleTime: Infinity,               // never auto-refetch afterward — WS owns updates from here
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const isLightsOn = data?.status === 'ON';
  const isFaulty = data?.status === 'FAULTY';
  const hasData = !!data;

  return { reading: data, isLightsOn, isFaulty, hasData, isLoading, isError };
};

