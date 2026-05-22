import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';

const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { setActiveIncidents, addOrUpdateIncident, removeIncident } =
    useLiveIncidentStore();

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('✅ WebSocket connected');

    ws.onmessage = (event) => {
      console.log(' Raw WS Message:', event.data);

      try {
        const parsed = JSON.parse(event.data);
        console.log(' Parsed WS Data:', parsed);

        const { topic, data } = parsed;

        //  Incident events

        // Initial list of active incidents to display when opening or refreshing the page
        if (topic === 'active_incidents') {
          console.log('📥 Initial Active Incidents List Received:', data);
          setActiveIncidents(data);
        } else if (
          topic === 'incident:created' ||
          topic === 'incident:updated'
        ) {
          addOrUpdateIncident(data);
        } else if (
          topic === 'incident:resolved' ||
          topic === 'incident:AI CLEARED-AWAITING CONFIRMATION'
        ) {
          console.log(
            ' Incident Resolved/Cleared, removing from view:',
            data?._id || data?.incidentId,
          );

          const targetId = data?._id || data?.incidentId;
          if (targetId) {
            removeIncident(targetId);
          }
        }

        //  Sensor events
        else if (topic === 'ldr') {
          queryClient.invalidateQueries({ queryKey: ['LDRValue'] });
          queryClient.invalidateQueries({ queryKey: ['lightStatus'] });
        } else if (topic === 'dht11') {
          queryClient.invalidateQueries({ queryKey: ['DHT11Value'] });
        } else if (topic === 'bmp180') {
          queryClient.invalidateQueries({ queryKey: ['BMB180Value'] });
        } else if (topic === 'mq135') {
          queryClient.invalidateQueries({ queryKey: ['MQ135Value'] });
        } else if (topic === 'flame') {
          queryClient.invalidateQueries({ queryKey: ['FlameValue'] });
        }

        //  Summaries update
        const allSensors = ['ldr', 'dht11', 'bmp180', 'mq135', 'flame'];
        if (allSensors.includes(topic)) {
          queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
          queryClient.invalidateQueries({ queryKey: ['TotalData'] });
          console.log(`✅ Updated ${topic} and Summaries`);
        }
      } catch (err) {
        console.error('❌ Error in WS Message:', err);
      }
    };

    ws.onclose = () => console.log('⚠️ WebSocket disconnected');
    ws.onerror = (error) => console.log('❌ WebSocket error:', error);

    return () => {
      console.log('🔌 Closing WebSocket connection');
      ws.close();
    };
  }, [queryClient, setActiveIncidents, addOrUpdateIncident, removeIncident]);
};

export default useWebSocket;
