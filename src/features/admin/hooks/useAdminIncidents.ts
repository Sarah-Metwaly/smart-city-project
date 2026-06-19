import { useState, useCallback } from 'react';
import { adminService } from '../services/admin.services';
import type { Incident } from '../types/admin.types';

export function useAdminIncidents(
  showToast: (msg: string, type: 'success' | 'error') => void,
) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [incidentFilters, setIncidentFilters] = useState({
    type: '',
    status: '',
    priority: '',
  });

    const [incidentsLoading, setIncidentsLoading] = useState(false);
  
  const fetchIncidents = useCallback(async () => {
        setIncidentsLoading(true);
        try {
          const params = new URLSearchParams();
          if (incidentFilters.type) params.set('type', incidentFilters.type);
          if (incidentFilters.status) params.set('status', incidentFilters.status);
          if (incidentFilters.priority)
            params.set('priority', incidentFilters.priority);
    
          const res = await adminService.getIncidents(params);
          setIncidents(res.data.data ?? []);
        } catch {
          showToast('Failed to load incidents', 'error');
        } finally {
          setIncidentsLoading(false);
        }
  }, [incidentFilters]);

  return {
    incidents,
    incidentFilters,
    setIncidentFilters,
    incidentsLoading,
    fetchIncidents,
  };
}