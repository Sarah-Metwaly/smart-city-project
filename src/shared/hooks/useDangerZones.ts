import { useQuery } from '@tanstack/react-query';
import { fetchDangerZones } from '../api/dangerZones.api';

export const useDangerZones = (type?: string) => {
  return useQuery({
    queryKey: ['dangerZones', type],
    queryFn: () => fetchDangerZones(type),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
};