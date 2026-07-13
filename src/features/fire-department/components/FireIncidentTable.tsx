import React from "react";
import { Flame } from "lucide-react";
import { useIncidents } from "../../../shared/hooks/useIncidentTable";
import IncidentTable from "../../../shared/ui/organisms/IncidentsTable";

const FireTypes = [
   'FLAME_DETECTION' ,
   'POOR_AIR_QUALITY',
   'HIGH_HUMIDITY' , 
   'FIRE_DETECTION', 
   "LOW_PRESSURE", 
   "HIGH_PRESSURE" ,
  'ENERGY_ANOMALY',
  'HIGH_TEMPERATURE'

];
export default function FireIncidents() {
  const { Incidents, isLoading, isError } = useIncidents(
    "/api/v1/incidents/DailyIncidents?type=FLAME_DETECTION&type=POOR_AIR_QUALITY&type=HIGH_HUMIDITY&type=FIRE_DETECTION&type=LOW_PRESSURE&type=HIGH_PRESSURE&type=ENERGY_ANOMALY&type=HIGH_TEMPERATURE"
  );

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