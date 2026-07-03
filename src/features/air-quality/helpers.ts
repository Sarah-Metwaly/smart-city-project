import {type  AQStatus } from "./types/airQuality";

export function normalizeLevel(level: string): AQStatus {
  const l = level.toLowerCase();
  if (l.includes("high") || l.includes("danger")) return "danger";
  if (l.includes("medium") || l.includes("warning") || l.includes("moderate")) return "warning";
  if (l.includes("low") || l.includes("normal") || l.includes("safe") || l.includes("good")) return "normal";
  return "stable";
}

export function getCoStatus(v: number): AQStatus {
  if (v >= 35) return "danger";
  if (v >= 9) return "warning";
  return "normal";
}

export function getCo2Status(v: number): AQStatus {
  if (v >= 1500) return "danger";
  if (v >= 1000) return "warning";
  return "normal";
}

export function getHumidityStatus(v: number): AQStatus {
  if (v < 20 || v > 80) return "warning";
  return "normal";
}

export function getPressureStatus(v: number): AQStatus {
  if (v < 980 || v > 1040) return "warning";
  return "normal";
}

export function getAQIColor(v: number): string {
  if (v <= 50) return "#2EC4A9";
  if (v <= 100) return "#F4E623";
  if (v <= 150) return "#F4A623";
  return "#E63946";
}

export function getAQIMarkerLeft(v: number): string {
  return `${Math.min((v / 200) * 100, 100)}%`;
}