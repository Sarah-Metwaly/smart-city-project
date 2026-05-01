import React, { useState } from "react";
import { AlertTriangle, Camera, Eye, EyeOff, FileText, Shield } from "lucide-react";
import StatCards from "../../../shared/ui/organisms/StatCards";
import PoliceLiveFeed from "../components/PoliceLiveFeed";
import CitySurveillanceMap from "../../../shared/ui/organisms/CitySurveillanceMap";
import ActiveAlertsSidebar from "../../../shared/ui/organisms/ActiveAlertsSidebar";
import IncidentTable from "../../../shared/ui/organisms/IncidentTable";

type AlertStatus = 'active' | 'dispatched' | 'resolved';

interface AlertSummary {
  id: number;
  status: AlertStatus;
}

const LiveEventsView: React.FC = () => {
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const ALERTS_DATA: AlertSummary[] = [
    { id: 1, status: "active" },
    { id: 2, status: "active" },
  ];

  const surveillanceStats = [
  { title: "Active Cameras", value: "24", icon: Camera, badge: "LIVE", colorClass: { bg: "bg-aman-red", text: "text-[#ff4d4d]" } },
  { title: "Officers On Duty", value: "08", icon: Shield, badge: "+2", colorClass: { bg: "bg-aman-green", text: "text-[#4caf8a]" } },
  { title: "Incidents Today", value: "12", icon: FileText, badge: "TODAY", colorClass: { bg: "bg-aman-cyan", text: "text-[#7ecfcf]" } },
  { title: "Active Alerts", value: "03", icon: AlertTriangle, badge: "URGENT", colorClass: { bg: "bg-aman-orange", text: "text-[#f5a623]" } },
];
  return (
    <>
      <div className="flex flex-col min-h-screen gap-6 px-4 py-5 font-mono text-aman-white sm:px-6 lg:px-12">
        {/* 1. KPI SECTION */}
      <StatCards stats={surveillanceStats} />
        {/* 2. MASTER FEED (Main Screen) */}
        <div className="relative bg-aman-teal border border-aman-teal rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(30,58,70,0.45)]">
          <button
            onClick={() => setShowGrid((p) => !p)}
            className={`absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[1.5px] uppercase backdrop-blur-md border transition-all duration-200
              ${showGrid ? "bg-aman-cyan/15 border-aman-cyan/40 text-aman-cyan" : "bg-black/65 border-aman-teal/80 text-aman-gray hover:text-aman-light"}`}
          >
            {showGrid ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
            {showGrid ? "SINGLE VIEW" : "ALL CAMERAS"}
          </button>

          {showGrid ? (
            <div className="p-20 text-center text-aman-gray">
              Camera Grid Component
            </div>
          ) : (
            <PoliceLiveFeed />
          )}
        </div>

        {/* MIDDLE SECTION: MAP + ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* MAP CONTAINER */}
          <div className="flex flex-col overflow-hidden border shadow-lg bg-aman-teal border-aman-teal rounded-2xl min-h-100">
            <CitySurveillanceMap />
          </div>

          {/* ALERTS SIDEBAR */}
          <div className="flex flex-col overflow-hidden border shadow-lg bg-aman-teal border-aman-teal rounded-2xl max-h-100">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-aman-teal/70 shrink-0">
              <span className="text-[10px] font-medium tracking-[2px] uppercase text-aman-white">
                Active Intelligence
              </span>
              <div className="flex items-center gap-1.5 text-aman-red">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="text-[8px] font-bold tracking-[1px]">
                  {ALERTS_DATA.length} ACTIVE
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ActiveAlertsSidebar />
            </div>
          </div>
        </div>

        {/* INCIDENT REPORTS */}
        <div className="w-full">
          <IncidentTable />
        </div>
      </div>
    </>
  );
};

export default LiveEventsView;