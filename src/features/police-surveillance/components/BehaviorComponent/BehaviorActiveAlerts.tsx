import React from "react";
import { type BehaviorActiveAlert, type Severity } from "../../../../types/fireAlert.types";
import { useActiveAlerts } from "../../../fire-department/hooks/useActiveAlerts";
import ActiveAlertsSidebar from "../../../../shared/ui/organisms/ActiveAlertsSidebar";


const behaviorTypes = [
  "MEDICAL_EMERGENCY",
  "CROWD_MANAGEMENT",
  "THEFT_DETECTION",
  "BEHAVIOR_ANOMALY"
];

// ── Data mapper ────────────────────────────────────────────────────────────
// Isolated so swapping API shape only touches this function.
function mapIncidentToAlert(incident: any): BehaviorActiveAlert {
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
interface BehaviorAlertsContainerProps {
  alerts: BehaviorActiveAlert[];
}

export const BehaviorAlertsContainer: React.FC<BehaviorAlertsContainerProps> = ({
  alerts,
}) => {
  return <ActiveAlertsSidebar alerts={alerts} title="Active Behavior Alerts" />;
};

// ── Page-level default export ──────────────────────────────────────────────
// Calls the hook, maps data, renders the container.
// On other pages: import { FireAlertsContainer } and pass your own alerts.
export default function BehaviorActiveAlerts() {
  const { fireIncidents, isLoading, isError } = useActiveAlerts();

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

  const alerts: BehaviorActiveAlert[] = (fireIncidents || [])
  .filter((incident: any) => behaviorTypes.includes(incident.type))
  .map(mapIncidentToAlert);


return <BehaviorAlertsContainer alerts={alerts} />;
}