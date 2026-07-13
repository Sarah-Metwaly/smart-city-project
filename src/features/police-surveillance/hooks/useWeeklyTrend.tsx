import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyTrend } from '../../../shared/api/incidents.api';
import type { WeeklyTrendPoint } from '../../../shared/api/incidents.api';

export function useWeeklyTrend() {
  const { data, isLoading, isError } = useQuery<WeeklyTrendPoint[]>({
    queryKey: ['weeklyTrend'],
    queryFn: fetchWeeklyTrend,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { 
    data: data || [], 
    isLoading, 
    isError 
  };
}
