import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';
import { type SensorData } from '../../features/air-quality/types/airQuality';
import {
  toMQ135Data,
  toBMP180Data,
  toDHT11Data,
} from '../../features/air-quality/services/airQuality.mappers';

const AIR_QUALITY_TOPICS = new Set(['mq135', 'bmp180', 'dht11']);

const OTHER_SENSOR_QUERY_MAP: Record<string, string[]> = {
  ldr: ['LDRValue', 'lightStatus'],
  flame: ['FlameValue'],
};

const SUMMARY_KEYS = ['weeklySummary', 'TotalData'];

const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { setActiveIncidents, addOrUpdateIncident, removeIncident } =
    useLiveIncidentStore();

  useEffect(() => {
    const invalidate = (keys: string[]) =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));

    const handleMessage = ({ data: raw }: MessageEvent) => {
      let topic: string, data: any;
      try {
        ({ topic, data } = JSON.parse(raw));
      } catch {
        return console.error('❌ Failed to parse WS message');
      }
      if (!topic) return;

      // incident events
      switch (topic) {
        case 'active_incidents': return setActiveIncidents(data);
        case 'incident:created':
        case 'incident:updated': return addOrUpdateIncident(data);
        case 'incident:resolved':
        case 'incident:ai_cleared': {
          const id = data?._id || data?.incidentId;
          return id && removeIncident(id);
        }
      }

      // air quality sensors - direct update to the React Query cache
      if (AIR_QUALITY_TOPICS.has(topic)) {
        queryClient.setQueryData<SensorData>(['air-quality'], (old) => {
          if (!old) return old;
          if (topic === 'mq135') return { ...old, mq135: toMQ135Data(data) };
          if (topic === 'bmp180') return { ...old, bmp180: toBMP180Data(data) };
          return { ...old, dht11: toDHT11Data(data) };
        });
        return invalidate(SUMMARY_KEYS);
      }

      // Other sensors
      if (OTHER_SENSOR_QUERY_MAP[topic]) {
        invalidate(OTHER_SENSOR_QUERY_MAP[topic]);
        invalidate(SUMMARY_KEYS);
      }
    };

    // WebSocket connection
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onmessage = handleMessage;
    ws.onerror = (err) => console.error('❌ WebSocket error:', err);

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useWebSocket;
