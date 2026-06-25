import React from "react";
import { Flame } from "lucide-react";
import { useIncidents } from "../../../shared/hooks/useIncidentTable";
import IncidentTable from "../../../shared/ui/atoms/IncidentsTable";

export default function FireIncidents() {
  const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents?type=FIRE_DETECTION");

  return (
    <div className="m-5 ">
      <IncidentTable
        incidents={Incidents}
        isLoading={isLoading}
        isError={isError}
        title="FIRE INCIDENTS REPORT"
        icon={<Flame size={14} />}
      />
    </div>
  );
}