// import { useEffect, useRef } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';
// import { type SensorData } from '../../features/air-quality/types/airQuality';
// import {
//   toMQ135Data,
//   toBMP180Data,
//   toDHT11Data,
// } from '../../features/air-quality/services/airQuality.mappers';

// const AIR_QUALITY_TOPICS = new Set(['mq135', 'bmp180', 'dht11']);

// const OTHER_SENSOR_QUERY_MAP: Record<string, string[]> = {
//   ldr: ['LDRValue', 'lightStatus'],
//   flame: ['FlameValue'],
// };

// const SUMMARY_KEYS = ['weeklySummary', 'TotalData'];

// const useWebSocket = () => {
//   const queryClient = useQueryClient();
//   const { setActiveIncidents, addOrUpdateIncident, removeIncident } =
//     useLiveIncidentStore();
//   const wsRef = useRef<WebSocket | null>(null);
//   const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

//   useEffect(() => {
//     const invalidate = (keys: string[]) =>
//       keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));

//     const connect = () => {
//       const ws = new WebSocket(import.meta.env.VITE_WS_URL);
//       wsRef.current = ws;

//       ws.onopen = () => console.log('✅ WebSocket connected');

//       ws.onmessage = ({ data: raw }: MessageEvent) => {
//         let topic: string, data: any;
//         try {
//           ({ topic, data } = JSON.parse(raw));
//         } catch {
//           console.error('❌ Failed to parse WS message');
//           return;
//         }
//         if (!topic) {
//           console.warn('⚠️ WS message missing topic');
//           return;
//         }

//         // incident events
//         if (topic === 'active_incidents') {
//           setActiveIncidents(data);
//           const formattedPayload = { status: 'success', length: data.length, data };
//           queryClient.setQueryData(['ActiveAlerts'], formattedPayload);
//           queryClient.setQueryData(['Incidents', '/api/v1/incidents/DailyIncidents'], formattedPayload);
//           return;
//         }

//         if (
//           topic === 'incident:created' ||
//           topic === 'incident:updated' ||
//           topic === 'incident:resolved' ||
//           topic === 'incident:AI CLEARED-AWAITING CONFIRMATION'
//         ) {
//           if (topic === 'incident:created' || topic === 'incident:updated') {
//             addOrUpdateIncident(data);
//           } else {
//             const targetId = data?._id || data?.incidentId;
//             if (targetId) removeIncident(targetId);
//           }
//           invalidate(['ActiveAlerts']);
//           invalidate(['Incidents']);
//           return;
//         }

//         // air quality sensors — direct update to the React Query cache,
//         // rebuilding from defaults if the cache is still empty (e.g. the
//         // initial REST fetch failed partially)
//         if (AIR_QUALITY_TOPICS.has(topic)) {
//           queryClient.setQueryData<SensorData>(['air-quality'], (old) => {
//             const base: SensorData = old ?? {
//               mq135: toMQ135Data(undefined as any),
//               bmp180: toBMP180Data(undefined),
//               dht11: toDHT11Data(undefined),
//             };

//             if (topic === 'mq135') return { ...base, mq135: toMQ135Data(data) };
//             if (topic === 'bmp180') return { ...base, bmp180: toBMP180Data(data) };
//             return { ...base, dht11: toDHT11Data(data) };
//           });
//           invalidate(SUMMARY_KEYS);
//           return;
//         }

//         // other sensors (ldr, flame, ...)
//         if (OTHER_SENSOR_QUERY_MAP[topic]) {
//           invalidate(OTHER_SENSOR_QUERY_MAP[topic]);
//           invalidate(SUMMARY_KEYS);
//         }


//       };

//       ws.onclose = () => {
//         console.log('⚠️ WebSocket disconnected, retrying in 3s...');
//         reconnectTimeout.current = setTimeout(connect, 3000);
//       };

//       ws.onerror = (error) => {
//         console.log('❌ WebSocket error:', error);
//         ws.close();
//       };
//     };

//     connect();

//     return () => {
//       if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
//       wsRef.current?.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
// };

// export default useWebSocket;

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';
import { type SensorData } from '../../features/air-quality/types/airQuality';
import {
  toMQ135Data,
  toBMP180Data,
  toDHT11Data,
} from '../../features/air-quality/services/airQuality.mappers';

const AIR_QUALITY_TOPICS = new Set(['mq135', 'bmp180', 'dht11']);
const SUMMARY_KEYS = ['weeklySummary', 'TotalData'];

const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { setActiveIncidents, addOrUpdateIncident, removeIncident } =
    useLiveIncidentStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const invalidate = (keys: string[]) =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));

    const connect = () => {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => console.log('✅ WebSocket connected');

      ws.onmessage = ({ data: raw }: MessageEvent) => {
        let topic: string, data: any;
        try {
          ({ topic, data } = JSON.parse(raw));
        } catch {
          console.error('❌ Failed to parse WS message');
          return;
        }
        if (!topic) {
          console.warn('⚠️ WS message missing topic');
          return;
        }

        // incident events
        if (topic === 'active_incidents') {
          setActiveIncidents(data);
          const formattedPayload = { status: 'success', length: data.length, data };
          queryClient.setQueryData(['ActiveAlerts'], formattedPayload);
          queryClient.setQueryData(['Incidents', '/api/v1/incidents/DailyIncidents'], formattedPayload);
          return;
        }

        if (
          topic === 'incident:created' ||
          topic === 'incident:updated' ||
          topic === 'incident:resolved' ||
          topic === 'incident:AI CLEARED-AWAITING CONFIRMATION'
        ) {
          if (topic === 'incident:created' || topic === 'incident:updated') {
            addOrUpdateIncident(data);
          } else {
            const targetId = data?._id || data?.incidentId;
            if (targetId) removeIncident(targetId);
          }
          invalidate(['ActiveAlerts']);
          invalidate(['Incidents']);
          return;
        }

        // air quality sensors — unified cache entry
        if (AIR_QUALITY_TOPICS.has(topic)) {
          queryClient.setQueryData<SensorData>(['air-quality'], (old) => {
            const base: SensorData = old ?? {
              mq135: toMQ135Data(undefined as any),
              bmp180: toBMP180Data(undefined),
              dht11: toDHT11Data(undefined),
            };

            if (topic === 'mq135') return { ...base, mq135: toMQ135Data(data) };
            if (topic === 'bmp180') return { ...base, bmp180: toBMP180Data(data) };
            return { ...base, dht11: toDHT11Data(data) };
          });
          invalidate(SUMMARY_KEYS);
          return;
        }

        // LDR — push the live reading directly (WS-only key, no REST fallback)
        if (topic === 'ldr') {
          console.log('🔦 LDR message received:', data);
          queryClient.setQueryData(['LDRValue'], data);
          invalidate(['lightStatus']);
          invalidate(SUMMARY_KEYS);
          return;
        }

        // Flame — push the live reading directly (WS-only key, no REST fallback)
        if (topic === 'flame') {
          queryClient.setQueryData(['flameSensorStatus'], data);
          invalidate(SUMMARY_KEYS);
          return;
        }
      };

      ws.onclose = () => {
        console.log('⚠️ WebSocket disconnected, retrying in 3s...');
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.log('❌ WebSocket error:', error);
        ws.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useWebSocket;