import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || import.meta.env.VITE_BASE_URL || '';

export interface DangerZone {
  zone: string;
  score: number;
  percentage: number;
}

export const fetchDangerZones = async (type?: string): Promise<DangerZone[]> => {
  const url = type 
    ? `${BASE_URL}/api/v1/dangerZones/weekly?type=${type}`
    : `${BASE_URL}/api/v1/dangerZones/weekly`;
    
  const { data } = await axios.get(url);
  return data.data;
};