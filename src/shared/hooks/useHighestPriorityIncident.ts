import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';

const PRIORITY_ORDER: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const useHighestPriorityIncident = () => {
  const { activeIncidents } = useLiveIncidentStore();

  if (activeIncidents.length === 0) {
    return { priorityIncidents: [], highestPriorityIncident: null, hasActiveAlert: false };
  }

  // sort the incidents by priority and then timestamp
  const priorityIncidents = [...activeIncidents].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority?.toUpperCase()] || 0;
    const priorityB = PRIORITY_ORDER[b.priority?.toUpperCase()] || 0;

   
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // if the priority are equal sort py timestamp
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA; 
  });

  // the top priority incident that will show on the camera
  const highestPriorityIncident = priorityIncidents[0] || null;

  return {
    priorityIncidents,         
    highestPriorityIncident,  
    hasActiveAlert: priorityIncidents.length > 0,
  };
};