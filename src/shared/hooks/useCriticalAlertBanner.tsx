import { useState, useEffect, useRef } from 'react';
import type { Incident } from '../types/incident';

export function useCriticalAlertBanner(incidents: Incident[], autoDismissMs = 6000) {
  const [bannerIncident, setBannerIncident] = useState<Incident | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newHighIncident = incidents.find(
      (i) =>
        !seenIds.current.has(i.incidentId) &&
        i.status === 'ACTIVE' &&
        i.priority?.toLowerCase() === 'high'
    );

    if (newHighIncident) {
      seenIds.current.add(newHighIncident.incidentId);
      setBannerIncident(newHighIncident);

      const timer = setTimeout(() => setBannerIncident(null), autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [incidents, autoDismissMs]);

  const dismissBanner = () => setBannerIncident(null);

  return { bannerIncident, dismissBanner };
}
