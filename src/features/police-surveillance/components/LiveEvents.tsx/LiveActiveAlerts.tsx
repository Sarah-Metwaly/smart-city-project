import React from "react";
import { type LiveActiveAlert, type Severity } from "../../../../types/fireAlert.types";
import ActiveAlertsSidebar from "../../../../shared/ui/organisms/ActiveAlertsSidebar";
import { useHighestPriorityIncident } from "../../../../shared/hooks/useHighestPriorityIncident"; 
import { useActiveAlerts } from "../../../fire-department/hooks/useActiveAlerts";



// ── Data mapper ────────────────────────────────────────────────────────────
// Isolated so swapping API shape only touches this function.
function mapIncidentToAlert(incident: any): LiveActiveAlert {
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
interface LiveAlertsContainerProps {
  alerts: LiveActiveAlert[];
}

export const LiveAlertsContainer: React.FC<LiveAlertsContainerProps> = ({
  alerts,
}) => {
  return <ActiveAlertsSidebar alerts={alerts} title="Active Live Alerts" />;
};

// ── Page-level default export ──────────────────────────────────────────────
// Calls the hook, maps data, renders the container.
// On other pages: import { FireAlertsContainer } and pass your own alerts.
export default function LiveActiveAlerts() {
  const { policeIncidents, isLoading, isError } = useActiveAlerts();
const { priorityIncidents } = useHighestPriorityIncident();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-10 font-mono text-sm"
        style={{ color: "#444" }}
      >
        Loading alerts...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center p-10 font-mono text-sm"
        style={{ color: "#ff4433" }}
      >
        Error fetching alerts.
      </div>
    );
  }

  // sort the alerts by priority then newest
  const source = priorityIncidents.length > 0 ? priorityIncidents : (policeIncidents || []);
 const alerts: LiveActiveAlert[] = source.map(mapIncidentToAlert);



return <LiveAlertsContainer alerts={alerts} />;
}