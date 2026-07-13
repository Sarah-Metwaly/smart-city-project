import { useState, useCallback, useEffect, useRef } from 'react';

export interface AlarmStatus {
    name: 'street' | 'fire' | 'police';
    status: boolean;
}

export type AlarmState = Record<AlarmStatus['name'], boolean>;

interface UseAlarmSystemReturn {
    alarms: AlarmState;
    setAlarm: (alarm: AlarmStatus) => void;
    toggleAlarm: (name: AlarmStatus['name']) => void;
    resetAlarms: () => void;
}

const initialAlarmState: AlarmState = {
    street: false,
    fire: false,
    police: false
};

/**
 * Custom hook for managing multiple alarm states
 * @returns Object containing alarm state and control functions
 */
export const useAlarmSystem = (): UseAlarmSystemReturn => {
    const [alarms, setAlarms] = useState<AlarmState>(initialAlarmState);

    /**
     * Set a specific alarm's status
     */
    const setAlarm = useCallback((alarm: AlarmStatus) => {
        setAlarms(prev => ({
            ...prev,
            [alarm.name]: alarm.status
        }));
    }, []);

    /**
     * Toggle a specific alarm's status
     */
    const toggleAlarm = useCallback((name: AlarmStatus['name']) => {
        setAlarms(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    }, []);

    /**
     * Reset all alarms to off
     */
    const resetAlarms = useCallback(() => {
        setAlarms(initialAlarmState);
    }, []);

    return {
        alarms,
        setAlarm,
        toggleAlarm,
        resetAlarms
    };
};

/**
 * Hook to sync alarm state with new incidents.
 * The alarm is enabled only when a new incident appears,
 * then automatically disabled after the provided duration.
 *
 * @param alarmName - Name of the alarm to sync
 * @param incidents - Current incidents list
 * @param setAlarm - Function to set alarm state
 * @param activeDurationMs - How long the alarm should stay active after a new incident
 */
export const useSyncAlarm = (
    alarmName: AlarmStatus['name'],
    incidents: Array<{ id?: string; incidentId?: string; createdAt?: string }>,
    setAlarm: (alarm: AlarmStatus) => void,
    activeDurationMs = 3000
): void => {
    const knownIncidentKeysRef = useRef<Set<string>>(new Set());
    const isInitializedRef = useRef(false);

    useEffect(() => {
        const currentIncidentKeys = incidents.map((incident) =>
            incident.id ?? incident.incidentId ?? incident.createdAt ?? ''
        ).filter(Boolean);

        if (!isInitializedRef.current) {
            knownIncidentKeysRef.current = new Set(currentIncidentKeys);
            isInitializedRef.current = true;
            setAlarm({ name: alarmName, status: false });
            return;
        }

        const hasNewIncident = currentIncidentKeys.some(
            (incidentKey) => !knownIncidentKeysRef.current.has(incidentKey)
        );

        knownIncidentKeysRef.current = new Set(currentIncidentKeys);

        if (!hasNewIncident) {
            setAlarm({ name: alarmName, status: false });
            return;
        }

        setAlarm({ name: alarmName, status: true });

        const timeoutId = window.setTimeout(() => {
            setAlarm({ name: alarmName, status: false });
        }, activeDurationMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [alarmName, incidents, setAlarm, activeDurationMs]);
};