import React from "react";
import { Flame } from "lucide-react";
import { useIncidents } from "../../../../shared/hooks/useIncidentTable";
import IncidentTable from "../../../../shared/ui/organisms/IncidentsTable";

export default function IncidentsTable() {
  const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents");

  return (
    
      <IncidentTable
        incidents={Incidents}
        isLoading={isLoading}
        isError={isError}
        title=" INCIDENTS REPORT"
        icon={<Flame size={14} />}
      />
   
  );
}