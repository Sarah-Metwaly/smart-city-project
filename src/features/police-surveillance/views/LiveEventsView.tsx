import React, { useState } from "react";
import { Activity, ShieldAlert, Siren, CheckCircle2,EyeOff,Eye} from "lucide-react";
import CitySurveillanceMap from "../../../shared/ui/organisms/CitySurveillanceMap";
import LiveActiveAlerts from "../components/LiveEvents.tsx/LiveActiveAlerts";
import { useIncidents } from "../../../shared/hooks/useIncidentTable";
import IncidentsTable from "../components/LiveEvents.tsx/AllIncidents";
import StatCards from "../../../shared/ui/organisms/StatCards";
import LiveStream from "../../../shared/ui/organisms/LiveStream";
 
  
const LiveEventsView: React.FC = () => {
  
  const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents");

  const total    = Incidents?.length ?? 0;
  const high     = Incidents?.filter((i) => i.priority === "HIGH").length ?? 0;
  const active   = Incidents?.filter((i) => i.status?.toUpperCase() === "ACTIVE").length ?? 0;
  const resolved = Incidents?.filter((i) => i.status?.toUpperCase() === "RESOLVED").length ?? 0;

 

const surveillanceStats = [
  { 
    title: "Total Alerts",     
    value: total,    
    icon: Activity, 
    badge: "LIVE",   
    colorClass: { bg: "bg-aman-blue/10", text: "text-[#38bdf8]" } 
  },
  { 
    title: "Active Alerts",    
    value: active,   
    icon: ShieldAlert, 
    badge: "LIVE",   
    colorClass: { bg: "bg-aman-red/10", text: "text-[#ff4d4d]" } 
  },
  { 
    title: "Emergency Alerts", 
    value: high,     
    icon: Siren, // 
    badge: "HIGH",   
    colorClass: { bg: "bg-amber-500/10", text: "text-[#fbbf24]" } 
  },
  { 
    title: "Resolved Alerts",  
    value: resolved, 
    icon: CheckCircle2, 
    badge: "CLEARED", 
    colorClass: { bg: "bg-aman-green/10", text: "text-[#4caf8a]" } 
  },
];
  return (
    <>
      <div className="flex flex-col min-h-screen gap-6 px-4 py-5 font-mono text-aman-white sm:px-6 lg:px-12">
        {/* 1. KPI SECTION */}
      <StatCards stats={surveillanceStats} />

        {/* 2. MASTER FEED (Main Screen) */}
        <div className="relative bg-aman-teal border border-aman-teal rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(30,58,70,0.45)]">
    
  {/* <CameraFeed /> */}
      <LiveStream streamUrl="http://20.233.89.255:8888/camera/index.m3u8" />
        </div>

        {/* MIDDLE SECTION: MAP + ALERTS */}
        <div className="grid grid-cols-12 gap-3">
          {/* MAP CONTAINER */}
          <div className="flex flex-col order-2 col-span-12 overflow-hidden border shadow-lg md:col-span-8 md:order-1 bg-aman-teal border-aman-teal rounded-2xl min-h-100">
            <CitySurveillanceMap />
          </div>

          {/* ALERTS SIDEBAR */}
          <div className="order-1 col-span-12 md:col-span-4 md:order-2">
            <LiveActiveAlerts/>
          </div>
        </div>

        {/* INCIDENT REPORTS */}
        <div className="w-full">
          <IncidentsTable/>
        </div>
      </div>
    </>
  );
};

export default LiveEventsView;