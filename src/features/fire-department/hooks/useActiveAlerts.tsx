import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// Fetch Active Incident from API 
const fetchActiveAlerts = async (): Promise<FAlertsData> => {
    const res = await axios.get(`${BASE_URL}/api/v1/incidents/DailyIncidents?&status=ACTIVE`);
    return res.data;
}

// Custom hook 
export const useActiveAlerts = () => {
    const { data, isLoading, isError } = useQuery<FAlertsData>({
        queryKey: ['ActiveAlerts'],
        queryFn: fetchActiveAlerts,
    });

    const fireIncidents = data?.data || [];
    
    // Returns true if there is more than 1 active incident
    const hasActiveAlarm = fireIncidents.length > 1;
    console.log(hasActiveAlarm);
    

    return {
        fireIncidents,
        isLoading,
        isError,
        hasActiveAlarm, 
    };
};