import React from "react";
import { Flame } from "lucide-react";
import { useIncidents } from "../../../../shared/hooks/useIncidentTable";
import IncidentTable from "../../../../shared/ui/atoms/IncidentsTable";

export default function BehaviorIncidents() {
  const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents?type=MEDICAL_EMERGENCY&type=CROWD_MANAGEMENT&type=THEFT_DETECTION&type=BEHAVIOR_ANOMALY");

  return (
    
      <IncidentTable
        incidents={Incidents}
        isLoading={isLoading}
        isError={isError}
        title="Behavior INCIDENTS REPORT"
        icon={<Flame size={14} />}
      />
   
  );
}