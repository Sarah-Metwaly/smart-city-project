import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTotalData } from "../../../shared/hooks/useTotalData";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


///////////////LDR////////////////
//fetch ldr Api 
const fetchLDRValue = async (): Promise<number> => {
  const res = await axios.get(`${BASE_URL}/api/v1/ldr/totalActiveLoad`);
  return res.data.data;
};

/////////DHT11/////////
export interface DHT11Data {
  temperature: number;
  humidity: number;
  status: string;
  power: number;
  
}


const fetchDHT11Value = async (): Promise<DHT11Data> => {
  const res = await axios.get(`${BASE_URL}/api/v1/dht11/latest`);
  return res.data.data[0]; 
};

///////BMB180/////
export interface BMB180DATA {
  temperature: number;
  pressure: number;
  altitude: number;
  status: string;
  power: number;
}
const fetchBMB180Value = async (): Promise<BMB180DATA> => {
  const res = await axios.get(`${BASE_URL}/api/v1/bmp180/latest`);
  return res.data.data[0]; 
};

/////////MQ135 ///////////////
export interface MQ135DATA {
  _id: string;          
  nh3: number;         
  benzene: number;      
  alcohol: number;      
  smoke: number;        
  co2: number;          
  co: number;           
  air_quality: string;  
  status: string;       
  power: number;        
  
}
const fetchMQ135Value = async (): Promise<MQ135DATA> => {
  const res = await axios.get(`${BASE_URL}/api/v1/mq135/latest`);
  console.log(res.data);
  
  return res.data.data[0]; 
};

//custom hook TANQUERY
export const useActivePower = () => {
  const {Total} = useTotalData();
  const TotalValue=Total?.totalActiveLoad || 0;

//get percentage 
const getPercent = (value: number = 0) => {
    if (TotalValue === 0) return 0;
    return parseFloat(((value / TotalValue) * 100).toFixed(1));
  };

  // FETCH LDR API
  const { 
    data: LDRValue,      
    isLoading: isLDRLoading, 
    isError: isLDRError 
  }
   = useQuery<number>({
    queryKey: ['LDRValue'],
    queryFn: fetchLDRValue,
     

  });

  // FETCH DHT11 API
  const { 
    data: DHT11Value,    
    isLoading: isDHT11Loading, 
    isError: isDHT11Error 
  } = useQuery<DHT11Data>({
    queryKey: ['DHT11Value'],
    queryFn: fetchDHT11Value,
         

  });

  //FETCH BMB180
  const { 
    data: BMB180Value,    
    isLoading: isBMB180Loading, 
    isError: isBMB180Error 
  } = useQuery<BMB180DATA>({
    queryKey: ['BMB180Value'],
    queryFn: fetchBMB180Value,
         

  });

   //FETCH MQ135
  const { 
    data: MQ135Value,    
    isLoading: isMQ135Loading, 
    isError: isMQ135Error 
  } = useQuery<MQ135DATA>({
    queryKey: ['MQ135Value'],
    queryFn: fetchMQ135Value,
         

  });

   

  

  
  return {
    LDRValue,  
    BMB180Value,      
    DHT11Value,  
    MQ135Value, 
    getPercent,  
    isLoading: isLDRLoading || isDHT11Loading ||isBMB180Loading || isMQ135Loading ,
    isError: isLDRError || isDHT11Error || isBMB180Error || isMQ135Error ,
    
  };
};

 