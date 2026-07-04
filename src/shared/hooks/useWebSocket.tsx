import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';

// Map MQTT/broadcast topic -> the query key it should populate
const SENSOR_QUERY_KEY_MAP: Record<string, string[]> = {
  ldr: ['LDRValue'],
  dht11: ['DHT11Value'],
  bmp180: ['BMP180Value'],
  mq135: ['MQValue'],
  flame: ['flameSensorStatus'],
};

const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { setActiveIncidents, addOrUpdateIncident, removeIncident } =
    useLiveIncidentStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;

    const connect = () => {
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => console.log('✅ WebSocket connected');

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const { topic, data } = parsed;

          if (!topic) {
            console.warn('⚠️ WS message missing topic:', parsed);
            return;
          }

          // 🚨 INCIDENT EVENTS
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
            queryClient.invalidateQueries({ queryKey: ['ActiveAlerts'] });
            queryClient.invalidateQueries({ queryKey: ['Incidents'] });
            return;
          }

          // 📊 SENSOR EVENTS
          const queryKey = SENSOR_QUERY_KEY_MAP[topic];
          if (queryKey) {
            queryClient.setQueryData(queryKey, data);

            if (topic === 'ldr') {
              queryClient.invalidateQueries({ queryKey: ['lightStatus'] });
            }

            queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
            queryClient.invalidateQueries({ queryKey: ['TotalData'] });
            console.log(`✅ Updated ${topic} cache + invalidated summaries`);
          }
        } catch (err) {
          console.error('❌ Error in WS Message:', err);
        }
      };

      ws.onclose = () => {
        console.log('⚠️ WebSocket disconnected, retrying in 3s...');
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.log('❌ WebSocket error:', error);
        ws.close(); // triggers onclose -> reconnect
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [queryClient, setActiveIncidents, addOrUpdateIncident, removeIncident]);
};

export default useWebSocket;