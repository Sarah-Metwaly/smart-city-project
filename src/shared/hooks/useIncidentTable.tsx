import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Interfaces ---
export interface Incident {
  id: string;
  incidentId: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'RESOLVED' | 'DISPATCHED';
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

export interface IncidentData {
  status: string;
  length: number;
  data: Incident[]; 
}

/**
 * Fetches data dynamically from the passed endpoint path
 * @param endpoint - The specific API path (e.g., '/api/v1/incidents/DailyIncidents?')
 */
const fetchIncidents = async (endpoint: string): Promise<IncidentData> => {
  const res = await axios.get(`${BASE_URL}${endpoint}`);
  return res.data;
};

/**
 * Reusable React Query custom hook for filtering core incidents
 * @param endpoint - The target API route for a specific page context
 */

export const useIncidents = (endpoint: string = "/api/v1/incidents/DailyIncidents") => {
    console.log("Hook is running with endpoint:", endpoint);
  const { data, isLoading, isError } = useQuery<IncidentData>({
    queryKey: ['Incidents', endpoint],
    queryFn: () => fetchIncidents(endpoint),
    staleTime: 0, 
  });

  return {
    Incidents: data?.data || [],
    isLoading,
    isError,
   
  };
};