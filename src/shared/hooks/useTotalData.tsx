import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TotalData {
  totalActiveLoad: number;
  totalEnergy: number;
  totalCost: number;
  totalAvgPower: number;
}

export interface TrendData {
   avgPowerPercentChange: number,
   avgPowerComment: string ,
   energyChangePercentChange: number,
    energyChangeComment: string,
    costChange: number,
    costChangeComment: string
}

//Api service
//fetch total data
const fetchtotal = async (): Promise<TotalData> => {
  const res = await axios.get(`${BASE_URL}/api/v1/summary/today`);
  console.log(`The total Active load` ,res.data.data);
  
  return res.data.data;
};

//fetch trenddata
const fetchtrend = async() : Promise<TrendData> =>{
    const res = await axios.get(`${BASE_URL}/api/v1/summary/comparison`);
     return res.data.data;
}

export const useTotalData = () => {
  const { 
    data: Total,    
    isLoading: isTotalLoading, 
    isError: isTotalError 
   } = useQuery<TotalData>({
    queryKey: ["TotalData"],
    queryFn: fetchtotal,
  });

  const { 
      data: trend,    
      isLoading: istrendLoading, 
      isError: istrendError 
    } = useQuery<TrendData>({
      queryKey: ['Trend'],
      queryFn: fetchtrend,
           
  
    });
  


  return {
    Total,
    trend,
    istrendLoading,
    isTotalLoading,
    isTotalError ,
    istrendError
  };
};
