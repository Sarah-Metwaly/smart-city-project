import { useQuery } from '@tanstack/react-query';
import { fetchAvgResponseTime } from '../../../shared/api/incidents.api';

export function useAvgResponseTime(date?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['avgResponseTime', date],
    queryFn: () => fetchAvgResponseTime(date),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    data: data || [],
    isLoading,
    isError: error ? error.message : null,
  };
}
