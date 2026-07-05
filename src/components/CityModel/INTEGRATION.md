# WebSocket Integration Guide

## Overview
The CityModel component now features **real-time alarm synchronization** with backend incidents via WebSocket. This means the fire alarm will automatically turn ON when incidents are detected and turn OFF when they're resolved.

## Prerequisites

### 1. WebSocket Connection
Ensure `useWebSocket()` is initialized in your app:

```tsx
// src/app/App.tsx
import useWebSocket from '../shared/hooks/useWebSocket';

function App() {
  useWebSocket(); // ✅ Required for real-time updates
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### 2. Environment Variables
Configure WebSocket URL in `.env`:

```env
VITE_WS_URL=ws://your-backend-server:8080
VITE_API_BASE_URL=http://your-backend-server:3000
```

## How It Works

### Data Flow

```typescript
// 1. Backend sends incident via WebSocket
{
  "topic": "incident:created",
  "data": {
    "incidentId": "INC-001",
    "type": "FIRE",
    "status": "ACTIVE",
    "priority": "HIGH",
    "location": {...}
  }
}

// 2. useWebSocket hook receives and processes
ws.onmessage = (event) => {
  const { topic, data } = JSON.parse(event.data);
  if (topic === 'incident:created') {
    addOrUpdateIncident(data); // Updates Zustand store
  }
}

// 3. useLiveIncidentStore updates
{
  activeIncidents: [incident],
  isAlertActive: true  // ← Triggers alarm
}

// 4. CityModel syncs automatically
useSyncAlarm('fire', isAlertActive, setAlarm);
// → alarms.fire = true
// → Fire warning lights turn ON
```

### WebSocket Topics Supported

| Topic | Action | Effect on Alarm |
|-------|--------|----------------|
| `active_incidents` | Bulk sync on connect | Sets initial alarm state |
| `incident:created` | New incident added | ✅ Turns alarm ON |
| `incident:updated` | Incident modified | Maintains alarm ON |
| `incident:resolved` | Incident cleared | ❌ Turns alarm OFF |
| `incident:AI CLEARED-AWAITING CONFIRMATION` | AI cleared | ❌ Turns alarm OFF |

## Testing Real-Time Alarms

### Method 1: Using Backend API

```bash
# Create a test incident
curl -X POST http://localhost:3000/api/v1/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "FIRE",
    "priority": "HIGH",
    "status": "ACTIVE",
    "location": {
      "name": "Building A",
      "coordinates": [31.2357, 30.0444]
    }
  }'

# Watch the CityModel - fire alarm should turn ON immediately!
```

### Method 2: Using Browser DevTools

```javascript
// Open browser console on your app
const store = window.__ZUSTAND_STORE__;

// Manually trigger incident
store.setState({
  activeIncidents: [{
    incidentId: 'TEST-001',
    type: 'FIRE',
    status: 'ACTIVE',
    priority: 'HIGH'
  }],
  isAlertActive: true
});

// Clear incident
store.setState({
  activeIncidents: [],
  isAlertActive: false
});
```

### Method 3: IoT Simulation

If you have IoT sensors connected:

1. Trigger your fire/flame sensor
2. Backend receives MQTT message
3. Backend publishes to WebSocket
4. Alarm activates in real-time

## Debugging

### Check WebSocket Connection

```typescript
// Add to your component for debugging
useEffect(() => {
  console.log('🔴 Alarm State:', alarms);
  console.log('📊 Active Incidents:', activeIncidents);
  console.log('⚠️ Is Alert Active:', isAlertActive);
}, [alarms, activeIncidents, isAlertActive]);
```

### Common Issues

#### ❌ Alarm doesn't activate
**Check:**
- Is WebSocket connected? (Look for "✅ WebSocket connected" in console)
- Is `useWebSocket()` called in App.tsx?
- Are incidents being received? (Check console for "📥 Incident change detected")

#### ❌ Alarm stays ON
**Check:**
- Are incidents being resolved on backend?
- Check `activeIncidents` array length
- Verify `status` field is changing to "RESOLVED"

#### ❌ Delay in activation
**Check:**
- Network latency
- WebSocket connection quality
- Backend processing time

## Performance Considerations

### Optimizations Already Implemented

1. **Memoized Model Component**: Uses `React.memo()` to prevent unnecessary re-renders
2. **Zustand Store**: Efficient state updates with minimal re-renders
3. **TanStack Query Integration**: Automatic cache invalidation and refetching
4. **Sync Hook**: Only updates when `isAlertActive` actually changes

### Best Practices

```typescript
// ✅ GOOD: Using the store selector
const isAlertActive = useLiveIncidentStore(state => state.isAlertActive);

// ❌ BAD: Destructuring everything (causes unnecessary re-renders)
const { activeIncidents, isAlertActive, /* ... */ } = useLiveIncidentStore();
```

## Advanced Usage

### Custom Alarm Logic

```typescript
// Create custom alarm conditions
const { activeIncidents } = useLiveIncidentStore();

const hasHighPriorityIncident = useMemo(() => 
  activeIncidents.some(inc => inc.priority === 'HIGH'),
  [activeIncidents]
);

// Sync with custom condition
useSyncAlarm('fire', hasHighPriorityIncident, setAlarm);
```

### Multiple Alarm Types

```typescript
// Fire alarms
const hasFireIncident = activeIncidents.some(inc => inc.type === 'FIRE');
useSyncAlarm('fire', hasFireIncident, setAlarm);

// Police alarms (if you add police incidents)
const hasPoliceIncident = activeIncidents.some(inc => inc.type === 'SECURITY');
useSyncAlarm('police', hasPoliceIncident, setAlarm);
```

## Production Checklist

- [ ] WebSocket URL configured in environment variables
- [ ] Error handling for WebSocket disconnections
- [ ] Reconnection logic implemented
- [ ] Backend sends proper incident status updates
- [ ] Testing with real IoT sensors completed
- [ ] Performance monitoring enabled
- [ ] Console logs removed/minimized for production

## Support

For WebSocket-related issues, check:
- Backend WebSocket server logs
- Browser network tab (WS connection)
- React Query DevTools for cache state
- Console logs for incident events

