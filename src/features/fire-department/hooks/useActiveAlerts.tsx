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

// Police-relevant incident types
const POLICE_INCIDENT_TYPES = [
    'THEFT_DETECTION',
    'WEAPON_DETECTION',
    'CROWD_MANAGEMENT',
    'BEHAVIOR_ANOMALY',
    'CITIZEN_CALL',
];

// Fetch active police-related incidents from API
const fetchActiveAlerts = async (): Promise<FAlertsData> => {
    const typeQuery = POLICE_INCIDENT_TYPES.map((t) => `type=${t}`).join('&');
    const res = await axios.get(
        `${BASE_URL}/api/v1/incidents/DailyIncidents?${typeQuery}&status=ACTIVE`
    );
    return res.data;
};

// Custom hook
export const useActiveAlerts = () => {
    const { data, isLoading, isError } = useQuery<FAlertsData>({
        queryKey: ['ActiveAlerts'],
        queryFn: fetchActiveAlerts,
    });

    const policeIncidents = data?.data || [];

    // Returns true if there is at least 1 active police-related incident
    const hasActiveAlarm = policeIncidents.length > 0;

    return {
        policeIncidents,
        isLoading,
        isError,
        hasActiveAlarm,
    };
};