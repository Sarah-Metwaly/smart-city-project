import React from "react";
import { type FireAlert, type Severity } from "../../../types/fireAlert.types";
import { useActiveAlerts } from "../hooks/useActiveAlerts";
import ActiveAlertsSidebar from "../../../shared/ui/organisms/ActiveAlertsSidebar";

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




// ── Data mapper ────────────────────────────────────────────────────────────
// Isolated so swapping API shape only touches this function.
function mapIncidentToAlert(incident: any): FireAlert {
 const rawPriority = incident.priority?.toLowerCase() ?? "low";
  const severity: Severity = ["high", "medium", "low"].includes(rawPriority)
    ? (rawPriority as Severity)
    : "low"; 

  return {
    id: incident._id,
    type:incident.type,
    location: incident.location?.name || "Unknown Location",
    zone: incident.location?.coordinates
      ? `Coordinates: ${incident.location.coordinates.join(", ")}`
      : "Unknown Zone",
    severity, 
    confidence: incident.aiData?.confidence
      ? Math.round(incident.aiData.confidence * 100)
      : 0,
    detectedAt: new Date(incident.createdAt).toLocaleTimeString("en-GB"),
    status: incident.status === "ACTIVE" ? "active" : "acknowledged",
  };
}

// ── Reusable container ────────────────────────────────────────────────────
// Import this directly on any other page and pass your own alerts array.
interface FireAlertsContainerProps {
  alerts: FireAlert[];
}

export const FireAlertsContainer: React.FC<FireAlertsContainerProps> = ({
  alerts,
}) => {
  return <ActiveAlertsSidebar alerts={alerts} title="Active Fire Alerts" />;
};

// ── Page-level default export ──────────────────────────────────────────────
// Calls the hook, maps data, renders the container.
// On other pages: import { FireAlertsContainer } and pass your own alerts.
export default function FireAlertsPage() {
  const { policeIncidents, isLoading, isError } = useActiveAlerts();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-10 text-sm font-mono"
        style={{ color: "#444" }}
      >
        Loading alerts...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center p-10 text-sm font-mono"
        style={{ color: "#ff4433" }}
      >
        Error fetching alerts.
      </div>
    );
  }

const alerts: FireAlert[] = (policeIncidents || [])
  .filter((incident: any) => FireTypes.includes(incident.type))
  .map(mapIncidentToAlert);

  return <FireAlertsContainer alerts={alerts} />;
}