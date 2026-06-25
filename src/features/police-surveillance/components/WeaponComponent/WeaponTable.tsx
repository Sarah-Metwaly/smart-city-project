import React from "react";
import { Flame } from "lucide-react";
import { useIncidents } from "../../../../shared/hooks/useIncidentTable";
import IncidentTable from "../../../../shared/ui/atoms/IncidentsTable";

export default function WeaponIncidents() {
  const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents?type=WEAPON_DETECTION");

  return (
   
      <IncidentTable
        incidents={Incidents}
        isLoading={isLoading}
        isError={isError}
        title="Weapon INCIDENTS REPORT"
        icon={<Flame size={14} />}
      />
    
  );
}