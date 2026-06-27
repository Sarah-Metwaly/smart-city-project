import api from '../../shared/api/axiosInstance';

export interface WeeklyTrendPoint {
  _id: string;
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export interface HourlyPoint {
  hour: string;
  avgTime: number;
}

export interface DangerZone {
  zone: string;
  score: number;
  percentage: number;
}

export const fetchWeeklyTrend = async (): Promise<WeeklyTrendPoint[]> => {
  const { data } = await api.get('/api/v1/incident-summary/weekly-trend');
  return data.data;
};

export const fetchAvgResponseTime = async (date?: string): Promise<HourlyPoint[]> => {
  const target = date ?? new Date().toISOString().split('T')[0];
  const { data } = await api.get(`/api/v1/incident-summary/avg-response-time?date=${target}`);
  return data.data;
};

export const fetchDangerZones = async (type?: string): Promise<DangerZone[]> => {
  const url = type
    ? `/api/v1/dangerZones/weekly?type=${type}`
    : `/api/v1/dangerZones/weekly`;
  const { data } = await api.get(url);
  return data.data;
};
