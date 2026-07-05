# CityModel Component

## Overview
A 3D interactive city model with real-time multi-alarm system powered by WebSocket for smart city monitoring.

## Features

### Real-Time Alarm Systems
The component supports three independent alarm types with **live WebSocket integration**:
- **Street Alarm** 🚨: Manual toggle, triggers street light blinking (red/yellow)
- **Fire Alarm** 🔥: **Auto-activated via WebSocket** when incidents are detected, controls fire warning lights
- **Police Alarm** 🚔: Manual toggle, controls police warning lights

### 🔴 WebSocket Integration (Fire Alarm)
The fire alarm is **automatically synchronized** with live incident data from the backend via WebSocket:

```typescript
// Monitors useLiveIncidentStore which receives real-time updates
const { isAlertActive, activeIncidents } = useLiveIncidentStore();

// Auto-syncs fire alarm with WebSocket incident status
useSyncAlarm('fire', isAlertActive, setAlarm);
```

#### How It Works:
1. **WebSocket Connection**: `useWebSocket()` hook (in App.tsx) establishes connection to backend
2. **Incident Events**: Server sends events like:
   - `incident:created` - New incident detected
   - `incident:updated` - Incident status changed  
   - `incident:resolved` - Incident cleared
   - `active_incidents` - Initial bulk sync
3. **Live Store Updates**: `useLiveIncidentStore` updates `isAlertActive` in real-time
4. **Alarm Sync**: Fire alarm turns ON/OFF automatically based on `isAlertActive`
5. **Visual Feedback**: Display shows live incident count

**Result**: Fire alarm stays ON as long as incidents are being received through WebSocket and turns OFF when they're resolved.

### Custom Hook: `useAlarmSystem`
A reusable hook for managing multiple alarm states with type safety.

```typescript
const { alarms, setAlarm, toggleAlarm, resetAlarms } = useAlarmSystem();

// Toggle an alarm
toggleAlarm('street'); // or 'fire' or 'police'

// Set specific alarm status
setAlarm({ name: 'fire', status: true });

// Reset all alarms
resetAlarms();
```

### Sync Alarm Hook: `useSyncAlarm`
Automatically syncs an alarm with external data source (WebSocket, API, etc.).

```typescript
// Sync fire alarm with live incident detection from WebSocket
useSyncAlarm('fire', isAlertActive, setAlarm);
```

### 3D Model Material Mapping
- `streetColor` (`[Color_001]4`): Street lights with alarm blinking
  - **Normal mode**: Yellow (#eadb60), opacity: 0.35, intensity: 1.2
  - **Alarm mode**: Blinks red (#ff0000) ↔ yellow (#eadb60), same opacity & intensity (500ms intervals)
  - **Off mode**: Opacity: 0.0, intensity: 0.0
  
- `fireWarningLight` (`fire_warning`): Fire department warning lights with alarm blinking
  - **Normal (alarm off)**: Invisible (opacity: 0.0)
  - **Alarm mode**: Blinks bright red (#ff0000) ↔ dark red (#8B0000), opacity: 0.8, intensity: 2.0 (400ms intervals)
  
- `policeWarningLight` (`police_warning1`): Police warning lights with alarm blinking
  - **Normal (alarm off)**: Invisible (opacity: 0.0)
  - **Alarm mode**: Blinks bright blue (#0000ff) ↔ dark blue (#00008B), opacity: 0.8, intensity: 2.0 (350ms intervals)

**Design Philosophy**: 
- All lights use **semi-transparency** (opacity < 1.0) for realism
- **All alarm types now blink** when activated (not just street)
- Each alarm has its own blinking pattern and timing
- Blinking only affects **color**, not opacity or intensity
- Different blink speeds for visual distinction (street: 500ms, fire: 400ms, police: 350ms)

## Best Practices Implemented

### 1. **Component Memoization**
```typescript
const Model = memo(function Model({ ... }) { ... });
```
Prevents unnecessary re-renders when props haven't changed.

### 2. **Proper TypeScript Interfaces**
```typescript
interface AlarmStatus {
    name: 'street' | 'fire' | 'police';
    status: boolean;
}
```
Type-safe alarm management with literal types.

### 3. **Custom Hooks for Reusability**
- `useAlarmSystem`: Encapsulates alarm state logic
- `useSyncAlarm`: Handles external data synchronization
- Follows React hooks best practices with `useCallback` for stable references

### 4. **Centralized Material Updates**
```typescript
const updateMaterial = (material: MeshStandardMaterial, config: MaterialConfig): void
```
DRY principle - single function for all material updates.

### 5. **Color Management in Model Component**
The street light color-changing logic is encapsulated within the Model component:
- Color state (`currentColor`) managed internally in Model
- Blinking effect runs only when alarm is active and lights are on
- Parent component doesn't need to manage color state
- Cleaner separation: visual effects stay with the 3D model

### 6. **State Management**
- Uses `Record<AlarmStatus['name'], boolean>` for type-safe alarm state
- Memoized derived state with `useMemo` for fire alarm detection
- Proper cleanup in `useEffect` hooks

### 7. **Separation of Concerns**
- Material updates isolated in the Model component
- Business logic (alarm triggers) in parent CityModel
- Visual effects separated from state management
- Hooks extracted for reusability

## API Reference

### `useAlarmSystem()`
Returns:
- `alarms: AlarmState` - Current state of all alarms
- `setAlarm: (alarm: AlarmStatus) => void` - Set specific alarm status
- `toggleAlarm: (name: AlarmStatus['name']) => void` - Toggle alarm on/off
- `resetAlarms: () => void` - Reset all alarms to off

### `useSyncAlarm(alarmName, shouldBeActive, setAlarm)`
Parameters:
- `alarmName: 'street' | 'fire' | 'police'` - Which alarm to sync
- `shouldBeActive: boolean` - External condition
- `setAlarm: Function` - Alarm setter from useAlarmSystem

### `updateMaterial(material, config)`
Utility function for updating Three.js material properties:
- `material: MeshStandardMaterial` - The material to update
- `config: MaterialConfig` - Configuration with opacity, emissiveIntensity, color

## Usage Examples

### Basic Usage
```tsx
<CityModel />
```

### Using the Alarm System Independently
```tsx
import { useAlarmSystem } from './components/CityModel/useAlarmSystem';

function MyComponent() {
  const { alarms, toggleAlarm, setAlarm } = useAlarmSystem();
  
  return (
    <div>
      <button onClick={() => toggleAlarm('police')}>
        Toggle Police Alarm
      </button>
      <button onClick={() => setAlarm({ name: 'fire', status: true })}>
        Activate Fire Alarm
      </button>
      {alarms.fire && <div>🔥 Fire detected!</div>}
    </div>
  );
}
```

## Component Integration

The component automatically syncs with:
- `useLightSystem()` - System-wide light control
- `useActiveAlerts()` - Fire incident monitoring

## Controls
- **Mouse Drag**: Rotate the 3D model
- **Mouse Wheel**: Zoom in/out
- **Buttons**: Toggle street and police alarms
- **Auto**: Fire alarm activates when incidents detected via WebSocket

## WebSocket Architecture

```
┌─────────────────┐       WebSocket        ┌──────────────────┐
│  Backend MQTT   │ ───────────────────────>│  useWebSocket()  │
│   IoT Sensors   │    incident:created     │   (App.tsx)      │
└─────────────────┘    incident:updated     └──────────────────┘
                       incident:resolved              │
                                                      ▼
                                          ┌───────────────────────┐
                                          │ useLiveIncidentStore  │
                                          │  (Zustand + React)    │
                                          │                       │
                                          │  - activeIncidents[]  │
                                          │  - isAlertActive      │
                                          └───────────────────────┘
                                                      │
                                                      ▼
                                          ┌───────────────────────┐
                                          │   useSyncAlarm()      │
                                          │   Auto-sync hook      │
                                          └───────────────────────┘
                                                      │
                                                      ▼
                                          ┌───────────────────────┐
                                          │  CityModel Component  │
                                          │                       │
                                          │  🔥 Fire Alarm: ON    │
                                          │  💡 Warning Lights    │
                                          └───────────────────────┘
```

### Real-Time Flow:
1. IoT sensor detects fire/incident
2. Backend publishes to MQTT → WebSocket
3. `useWebSocket()` receives event
4. `useLiveIncidentStore` updates state
5. `isAlertActive` changes to `true`
6. `useSyncAlarm()` detects change
7. Fire alarm activates instantly
8. 3D model shows fire warning lights
9. When incident resolved → alarm auto-deactivates

## Material Configuration

Each alarm type controls its material with specific settings and blinking patterns:

| Alarm | Material | Normal Color | Alarm Colors | Opacity | Intensity | Blink Speed | Behavior |
|-------|----------|--------------|--------------|---------|-----------|-------------|----------|
| Street | streetColor | #eadb60 (yellow) | #ff0000 ↔ #eadb60<br>(red ↔ yellow) | 0.35 | 1.2 | 500ms | Blinks when alarm active |
| Fire | fireWarningLight | N/A (off) | #ff0000 ↔ #8B0000<br>(bright red ↔ dark red) | 0.8 | 2.0 | 400ms | Blinks when alarm active |
| Police | policeWarningLight | N/A (off) | #0000ff ↔ #00008B<br>(bright blue ↔ dark blue) | 0.8 | 2.0 | 350ms | Blinks when alarm active |

**Design Philosophy**: 
- All lights use **semi-transparency** (opacity < 1.0) for realism
- **All alarm types blink** with unique patterns when activated
- Blinking only affects **color**, maintaining constant opacity/intensity
- Different blink speeds create visual distinction between alarm types
- Street lights blink slower (emergency), police faster (urgency)


