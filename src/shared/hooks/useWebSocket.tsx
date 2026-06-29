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

        // 🚨 INCIDENT EVENTS
        if (topic === 'active_incidents') {
          console.log('📥 Initial Active Incidents List Received:', data);
          
          // 1. Update the local Zustand store for backward compatibility
          setActiveIncidents(data); 

          // 2. Directly seed the initial bulk array into TanStack Query caches
          const formattedPayload = { status: 'success', length: data.length, data: data };
          queryClient.setQueryData(['ActiveAlerts'], formattedPayload);
          queryClient.setQueryData(['Incidents', '/api/v1/incidents/DailyIncidents'], formattedPayload);

        } else if (
          topic === 'incident:created' ||
          topic === 'incident:updated' ||
          topic === 'incident:resolved' ||
          topic === 'incident:AI CLEARED-AWAITING CONFIRMATION'
        ) {
          console.log(`🔄 Incident change detected (${topic}) -> Syncing caches...`);

          // 1. Update the local Zustand store state
          if (topic === 'incident:created' || topic === 'incident:updated') {
            addOrUpdateIncident(data);
          } else {
            const targetId = data?._id || data?.incidentId;
            if (targetId) removeIncident(targetId);
          }

          // 2. Invalidate active query keys to trigger immediate background API refetches.
          // This keeps the UI perfectly synced, sorted, and filtered by the database.
          queryClient.invalidateQueries({ queryKey: ['ActiveAlerts'] });
          queryClient.invalidateQueries({ queryKey: ['Incidents'] });
        }

        // 📊 SENSOR EVENTS — written straight into the cache, no refetch
        else if (topic === 'ldr') {
          queryClient.setQueryData(['LDRValue'], data);       // ✅ raw ldr data fits LDRValue cache
          queryClient.invalidateQueries({ queryKey: ['lightStatus'] }); // ✅ forces a fresh fetch from /api/v1/ldr/status
        } else if (topic === 'dht11') {
          queryClient.setQueryData(['DHT11Value'], data);
        } else if (topic === 'bmp180') {
          queryClient.setQueryData(['BMB180Value'], data);
        } else if (topic === 'mq135') {
          queryClient.setQueryData(['MQ135Value'], data);
        } else if (topic === 'flame') {
          queryClient.setQueryData(['FlameValue'], data);
        }

        // 📈 SUMMARIES — invalidated since the WS payload doesn't carry the aggregated values
        const allSensors = ['ldr', 'dht11', 'bmp180', 'mq135', 'flame'];
        if (allSensors.includes(topic)) {
          queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
          queryClient.invalidateQueries({ queryKey: ['TotalData'] });
          console.log(`✅ Updated ${topic} cache + invalidated Summaries`);
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