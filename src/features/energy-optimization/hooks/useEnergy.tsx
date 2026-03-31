import { useQuery } from '@tanstack/react-query';
import axios from 'axios';



const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface WeeklyDayData {
  date: string;
  total_energy: number;
  total_cost: number;
}

export interface WeeklySummary {
  weeklyData: WeeklyDayData[];
  maxDay: WeeklyDayData;
}

//Api service 
const fetchEnergy = async (): Promise<WeeklySummary> => {
  const res = await axios.get(`${BASE_URL}/api/v1/summary/weekly`);
  return res.data.data

}

export const useWeeklySummary = () => {
     const { data, isLoading, isError } = useQuery<WeeklySummary>({
        queryKey: ['weeklySummary'],
        queryFn: fetchEnergy,
     });
     return {
     data,
    isLoading,
    isError,
   
  };


};
