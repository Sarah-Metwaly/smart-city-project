import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CategoryData {
  todayPercentage: number;
  changePercentage: number;
}

export interface CrimePercentageResponse {
  weapon: CategoryData;
  fire: CategoryData;
  behavior: CategoryData;
}

// 2. Update the API Service
const fetchLightState = async (): Promise<CrimePercentageResponse> => {
  const res = await axios.get(`${BASE_URL}/api/v1/incident-summary/dailyCrimeComparison`);
  return res.data.data; // This returns the object containing weapon, fire, behavior
};

// 3. Custom Hook
export const useCrimePercentage = () => {
  const { data, isLoading, isError } = useQuery<CrimePercentageResponse>({
    queryKey: ['crimepercentage'],
    queryFn: fetchLightState,
    staleTime: Infinity, 
  });

  useEffect(() => {
    if (data) {
      console.log("Crime Percentage :", data);
    }
  }, [data]);

  return {
    CrimePercentage: data,
    isLoading,
    isError,
  };
};