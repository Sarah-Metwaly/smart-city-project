import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export interface SensorData {
  total: number;
  on: number;
  off: number;
  faulty: number;
}


//API SERVICE
const fetchLightState = async (): Promise<SensorData> => {
  const res = await axios.get(`${BASE_URL}/api/v1/ldr/status`);
  return res.data.data;
};


// 2.Custom Hook
export const useLightSystem = () => {
  // TanStack Query
  const { data, isLoading, isError } = useQuery<SensorData>({
    queryKey: ['lightStatus'],
    queryFn: fetchLightState,
    staleTime: Infinity, 
  });


  useEffect(() => {
  if (data) {
  console.log("Current light Data:", data);
  }
}, [data]);
  

  // وظيفة إضافية جوه الهوك لحساب النسبة المئوية
  const getPercentage = (value: number | undefined): number => {
  if (!data || !data.total || data.total === 0) return 0;
  const Percentage = ((value || 0) / data.total) * 100;
  return parseFloat(Percentage.toFixed(1));
};


 
  return {
    sensorData: data,
    isLoading,
    isError,
    getPercentage
  };
};