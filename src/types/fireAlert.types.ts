export type Severity = "high" | "medium" | "low";

export interface FireAlert {
  id: string;
  location: string;
  type:string;
  zone: string;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  status: "active" | "acknowledged";
}

export interface BehaviorActiveAlert {
  id: string;
  type:string;
  location: string;
  zone: string;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  status: "active" | "acknowledged";
}

export interface WeaponActiveAlert {
  id: string;
  type:string;
  location: string;
  zone: string;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  status: "active" | "acknowledged";
}
export interface LiveActiveAlert {
  id: string;
  type:string;
  location: string;
  zone: string;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  status: "active" | "acknowledged";
}


export const SEVERITY_THEME: Record<
  Severity,
  { color: string; bg: string; border: string; label: string; glow: string }
> = {
  high: {
    color: "#ff4433",
    bg: "rgba(255,68,51,0.10)",
    border: "rgba(255,68,51,0.32)",
    label: "HIGH",
    glow: "rgba(255,68,51,0.13)",
  },
  medium: {
    color: "#ffaa33",
    bg: "rgba(255,170,51,0.10)",
    border: "rgba(255,170,51,0.28)",
    label: "MEDIUM",
    glow: "rgba(255,170,51,0.11)",
  },
  low: {
    color: "#2EC4A9",
    bg: "rgba(255,221,68,0.08)",
    border: "rgba(255,221,68,0.22)",
    label: "LOW",
    glow: "rgba(255,221,68,0.09)",
  },
};