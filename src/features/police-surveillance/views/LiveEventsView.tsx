import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import StatCards from "../components/StatCards";
import PoliceLiveFeed from "../components/PoliceLiveFeed";
import CitySurveillanceMap from "../components/CitySurveillanceMap";
import ActiveAlertsSidebar from "../components/ActiveAlertsSidebar";
import IncidentTable from "../components/IncidentTable";

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

  return (
    <>
      <div className="flex flex-col min-h-screen gap-6 px-4 py-5 font-mono bg-[#131a21] text-aman-white sm:px-6 lg:px-12">
        {/* 1. KPI SECTION */}
        <StatCards />

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
            // <PoliceLiveFeed />
          )}
        </div>

        {/* MIDDLE SECTION: MAP + ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* MAP CONTAINER */}
          <div className="flex flex-col overflow-hidden border shadow-lg bg-aman-teal border-aman-teal rounded-2xl min-h-[400px]">
            {/* <CitySurveillanceMap /> */}
          </div>

          {/* ALERTS SIDEBAR */}
          <div className="flex flex-col overflow-hidden border shadow-lg bg-aman-teal border-aman-teal rounded-2xl max-h-[400px]">
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
              {/* <ActiveAlertsSidebar /> */}
            </div>
          </div>
        </div>

        {/* INCIDENT REPORTS */}
        <div className="w-full">
          {/* <IncidentTable /> */}
        </div>
      </div>
    </>
  );
};

export default LiveEventsView;