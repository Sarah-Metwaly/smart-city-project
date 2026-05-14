import { create } from "zustand";
import type { Incident } from '../shared/types/incident';

interface IncidentState {
  latestIncident: Incident | null;
  isAlertActive: boolean;
  setLatestIncident: (incident: Incident) => void;
  updateIncident: (incident: Incident) => void;
  clearIncident: () => void;
  dismissAlert: () => void;
}

export const useLiveIncidentStore = create<IncidentState>((set, get) => ({
  latestIncident: null,
  isAlertActive: false,

  setLatestIncident: (incident) =>
    set({
      latestIncident: incident,
      isAlertActive: incident.status === "ACTIVE",
    }),

  updateIncident: (incident) => {
    const current = get().latestIncident;
    if (current && current.incidentId === incident.incidentId) {
      set({
        latestIncident: { ...current, ...incident },
        isAlertActive: incident.status === "ACTIVE",
      });
    } else {
      set({
        latestIncident: incident,
        isAlertActive: incident.status === "ACTIVE",
      });
    }
  },

  clearIncident: () => set({ latestIncident: null, isAlertActive: false }),
  dismissAlert: () => set({ isAlertActive: false }),
}));
