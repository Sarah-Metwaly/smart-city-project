import { create } from "zustand";
import type { Incident } from '../shared/types/incident';

interface IncidentState {
  activeIncidents: Incident[]; 
  // it become true if there is at least one active incident otherwise false
  isAlertActive: boolean;    
  setActiveIncidents: (incidents: Incident[]) => void;
  addOrUpdateIncident: (incident: Incident) => void;
  removeIncident: (incidentId: string) => void;
  clearAllIncidents: () => void;
  dismissAlert: () => void;
}

export const useLiveIncidentStore = create<IncidentState>((set, get) => ({
  activeIncidents: [],
  isAlertActive: false,

  /**
   * Performs an initial state synchronization with the backend.
   * Invoked upon WebSocket connection/page refresh to populate the store with all current active incidents.
   * @param {Incident[]} incidents - Array of active incidents fetched from the database.
   */
  setActiveIncidents: (incidents) => set({
    activeIncidents: incidents,
   isAlertActive: incidents.some(inc => inc.status === "ACTIVE"),
  }),

  //  handle real-time single incident updates pushed from MQTT/WebSockets.
  addOrUpdateIncident: (incident) => {
    const current = get().activeIncidents;
  
    const exists = current.some(inc => inc.incidentId === incident.incidentId);

    let updatedList;
    if (exists) {
      // update incident in place if it already exists
      updatedList = current.map(inc => 
        inc.incidentId === incident.incidentId ? { ...inc, ...incident } : inc
      );
    } else {
      updatedList = [incident, ...current];
    }

    set({
      activeIncidents: updatedList,
      isAlertActive: updatedList.some(inc => inc.status === "ACTIVE"),
    });
  },

  // it works if the incident become resolved or if we want to remove it from the list
  removeIncident: (incidentId) => {
    const filteredList = get().activeIncidents.filter(inc => inc.incidentId !== incidentId);
    set({
      activeIncidents: filteredList,
     isAlertActive: filteredList.some(inc => inc.status === "ACTIVE")
    });
  },

  clearAllIncidents: () => set({ activeIncidents: [], isAlertActive: false }),
  dismissAlert: () => set({ isAlertActive: false }),
}));