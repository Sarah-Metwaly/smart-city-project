import type { ActiveView } from "../types/admin.types";
import type { ReactNode } from "react";
import { TbLayoutDashboard, TbUsers, TbShieldHalfFilled, TbAlertTriangle, TbUserPlus } from "react-icons/tb";


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

// export const INCIDENT_ICON = {
//     SMOKE_DETECTION: "💨",
//     THEFT_DETECTION: "🔓",
//     FIRE_DETECTION: "🔥",
//     INTRUSION_DETECTION: "⚠️",
// };

export const navItems: { id: ActiveView; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <TbLayoutDashboard size={18} /> },
    { id: "users", label: "All Users", icon: <TbUsers size={18} /> },
    { id: "officers", label: "Officers", icon: <TbShieldHalfFilled size={18} /> },
    { id: "incidents", label: "Incidents", icon: <TbAlertTriangle size={18} /> },
    { id: "create-officer", label: "Create Officer", icon: <TbUserPlus size={18} /> },
  ];