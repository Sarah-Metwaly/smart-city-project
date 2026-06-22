// import { useState, useCallback } from 'react';
// import { adminService } from '../services/admin.services';
// import type { Incident } from '../types/admin.types';

// export function useAdminIncidents(
//   showToast: (msg: string, type: 'success' | 'error') => void,
// ) {
//   const [incidents, setIncidents] = useState<Incident[]>([]);

//   const [incidentFilters, setIncidentFilters] = useState({
//     type: '',
//     status: '',
//     priority: '',
//   });

//     const [incidentsLoading, setIncidentsLoading] = useState(false);
  
//   const fetchIncidents = useCallback(async () => {
//         setIncidentsLoading(true);
//         try {
//           const params = new URLSearchParams();
//           if (incidentFilters.type) params.set('type', incidentFilters.type);
//           if (incidentFilters.status) params.set('status', incidentFilters.status);
//           if (incidentFilters.priority)
//             params.set('priority', incidentFilters.priority);
    
//           const res = await adminService.getIncidents(params);
//           setIncidents(res.data.data ?? []);
//         } catch {
//           showToast('Failed to load incidents', 'error');
//         } finally {
//           setIncidentsLoading(false);
//         }
//   }, [incidentFilters]);

//   return {
//     incidents,
//     incidentFilters,
//     setIncidentFilters,
//     incidentsLoading,
//     fetchIncidents,
//   };
// }


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin.services";

export function useAdminIncidents(
  showToast: (msg: string, type: "success" | "error") => void
) {
  const queryClient = useQueryClient();

  const [incidentFilters, setIncidentFilters] = useState({
    type: "",
    status: "",
    priority: "",
  });

  // QUERY
  const incidentsQuery = useQuery({
    queryKey: ["incidents", incidentFilters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (incidentFilters.type) params.set("type", incidentFilters.type);
      if (incidentFilters.status) params.set("status", incidentFilters.status);
      if (incidentFilters.priority) params.set("priority", incidentFilters.priority);

      const res = await adminService.getIncidents(params);

      console.log("INCIDENT RESPONSE:", res.data);
      return res.data;
    },
  });

  // OPTIONAL MUTATION (future use)
  const updateIncidentMutation = useMutation({
    mutationFn: async (payload: any) => {
      return payload; // placeholder until real API exists
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      showToast("Updated successfully", "success");
    },
    onError: () => {
      showToast("Action failed", "error");
    },
  });

  return {
    incidents: incidentsQuery.data ?? [], // backend shape: { data: [] }

    incidentsLoading: incidentsQuery.isPending,

    incidentFilters,
    setIncidentFilters,

    refetch: incidentsQuery.refetch,

    isError: incidentsQuery.isError,
  };
}