export type Department =
  | "Police"
  | "Fire Department";

export type Role =
  | "citizen"
  | "officer"
  | "admin";

export type IncidentStatus =
  | "ACTIVE"
  | "RESOLVED"
  | "PENDING";

export type IncidentPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

type IncidentType =
  | "SMOKE_DETECTION"
  | "THEFT_DETECTION"
  | "FIRE_DETECTION"
  | "WEAPON_DETECTION"
  | "CROWD_MANAGEMENT"
  | "MEDICAL_EMERGENCY";

export interface User {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  department?: Department;
  badgeNumber?: string;
  officerPhoto?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Incident {
  _id: string;
  incidentId: string;
  type: IncidentType;
  priority: IncidentPriority;
  status: IncidentStatus;
  location: {
    name: string;
    coordinates: number[];
  };
  source: {
    type: string;
    deviceId: string;
  };
  createdAt: string;
}

export type ActiveView =
  | "overview"
  | "users"
  | "officers"
  | "incidents"
  | "create-officer";