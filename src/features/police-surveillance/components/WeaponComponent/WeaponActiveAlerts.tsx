import React from "react";
import { type WeaponActiveAlert, type Severity } from "../../../../types/fireAlert.types";
import ActiveAlertsSidebar from "../../../../shared/ui/organisms/ActiveAlertsSidebar";
import { useActiveAlerts } from "../../../fire-department/hooks/useActiveAlerts";



// ── Data mapper ────────────────────────────────────────────────────────────
// Isolated so swapping API shape only touches this function.
function mapIncidentToAlert(incident: any): WeaponActiveAlert {
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
interface WeaponAlertsContainerProps {
  alerts: WeaponActiveAlert[];
}

export const WeaponAlertsContainer: React.FC<WeaponAlertsContainerProps> = ({
  alerts,
}) => {
  return <ActiveAlertsSidebar alerts={alerts} title="Active Weapon Alerts" />;
};

// ── Page-level default export ──────────────────────────────────────────────
// Calls the hook, maps data, renders the container.
// On other pages: import { FireAlertsContainer } and pass your own alerts.
export default function WeaponActiveAlerts() {
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

  const alerts: WeaponActiveAlert[] = (policeIncidents || [])
  .filter((incident: any) => incident.type === "WEAPON_DETECTION")
  .map(mapIncidentToAlert);


return <WeaponAlertsContainer alerts={alerts} />;
}