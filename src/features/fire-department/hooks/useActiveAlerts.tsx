import { useQuery } from "@tanstack/react-query";
import axios from "axios";




const BASE_URL = import.meta.env.VITE_API_BASE_URL;
//interface

export interface Incident {
    id: string;
    incidentId: string;
    type: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: string;
    location: {
        name: string;
        coordinates: [number, number];
    };
    sensorData: {
        timestamp: string;
       
    };
    notes: string;
    createdAt: string;
}

export interface FAlertsData {
    status: string;
    length: number;
    data: Incident[]; 
}

//fetch Active Incident from Api 
const fetchActiveAlerts = async ():Promise<FAlertsData> =>{
    const res = await axios.get(`${BASE_URL}/api/v1/incidents/DailyIncidents?&status=ACTIVE`)
    console.log(res.data);
    
     return res.data
    
}

//custom hook 
export const useActiveAlerts =()=>{
     // TanStack Query
      const { data, isLoading, isError } = useQuery<FAlertsData>({
        queryKey: ['ActiveAlerts'],
        queryFn: fetchActiveAlerts,
      });

return {
    fireIncidents: data?.data || [],
    isLoading,
    isError,
}    
    
}

