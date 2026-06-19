import type { ActiveView } from "../types/admin.types";

export const PRIORITY_COLOR = {
    LOW: "text-green-400 bg-green-400/10",
    MEDIUM: "text-amber-400 bg-amber-400/10",
    HIGH: "text-red-400 bg-red-400/10",
};

export const STATUS_COLOR = {
    ACTIVE: "text-red-400 bg-red-400/10",
    PENDING: "text-amber-400 bg-amber-400/10",
    RESOLVED: "text-emerald-400 bg-emerald-400/10",
};

export const INCIDENT_ICON = {
    SMOKE_DETECTION: "💨",
    THEFT_DETECTION: "🔓",
    FIRE_DETECTION: "🔥",
    INTRUSION_DETECTION: "⚠️",
};

export const navItems: { id: ActiveView; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "⬡" },
    { id: "users", label: "All Users", icon: "◎" },
    { id: "officers", label: "Officers", icon: "◈" },
    { id: "incidents", label: "Incidents", icon: "⚡" },
    { id: "create-officer", label: "Create Officer", icon: "＋" },
  ];