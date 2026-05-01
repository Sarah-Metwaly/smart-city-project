import React from "react";
import StatCards from "../../../shared/ui/organisms/StatCards"; 
import WeaponAlertsFeed from "../../../shared/ui/organisms/ActiveAlertsSidebar"; 
import DangerZonesMap from "../../../shared/ui/organisms/CitySurveillanceMap"; 
import WeaponIncidentTable from "../../../shared/ui/organisms/IncidentTable"; 
import { AlertTriangle, Crosshair, Skull, Target, Activity } from "lucide-react";
import MonthlyCrimeChart from "../components/MonthlyCrimeChart";
import CameraFeed from "../../../shared/ui/organisms/CameraFeed";

const WeaponView: React.FC = () => {
  const weaponStats = [
    { title: "Major Alerts Today", value: "5", icon: AlertTriangle, badge: "ALERT", colorClass: { bg: "bg-aman-red/10", text: "text-red-500" } },
    { title: "Crime Rate", value: "12%", icon: Crosshair, badge: "RATE", colorClass: { bg: "bg-aman-cyan/10", text: "text-cyan-400" } },
    { title: "Armed Suspects", value: "4", icon: Target, badge: "SUSPECTS", colorClass: { bg: "bg-aman-orange/10", text: "text-orange-400" } },
    { title: "Danger Zones", value: "3", icon: Skull, badge: "DANGER", colorClass: { bg: "bg-aman-yellow/10", text: "text-yellow-400" } },
  ];

  return (
    <div className="flex flex-col min-h-screen gap-6 py-5 font-mono text-aman-white sm:px-6 lg:px-4">
      
      {/* 1. TOP STATS CARDS */}
      <StatCards stats={weaponStats} />

      {/* 2. PRIMARY UNIT: CAMERA FEED & ALERTS SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live Camera Feed */}
        <div className="h-95"> 
          <CameraFeed 
            location="Main Square - Gate 4" 
            status="PROCESSING"
          />
        </div>

        {/* Live Alerts (Match Queue) */}
        <div className="flex flex-col p-5 overflow-hidden border shadow-lg border-aman-teal/20 bg-aman-dark/40 rounded-2xl h-95">
           <h2 className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-4 border-b border-aman-teal/10 pb-2 flex items-center gap-2">
             <Activity size={14} /> Live Detection Stream
           </h2>
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <WeaponAlertsFeed />
           </div>
        </div>
      </div>

{/* 3. SECONDARY UNIT: MAP & CRIME RATE CHART SIDE-BY-SIDE */}
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* City Map */}
  <div className="overflow-hidden border shadow-lg border-aman-teal/20 rounded-2xl bg-aman-teal h-100">
    <div className="relative h-full">
      <DangerZonesMap />
    </div>
  </div>

  {/* Monthly Crime Rate Chart - */}
  <div className="overflow-hidden border shadow-lg border-aman-teal/20 rounded-2xl bg-aman-dark/40 h-100">
    <MonthlyCrimeChart />
  </div>
</div>

      {/* 4. FULL WIDTH INCIDENT LOGS */}
      <div className="flex flex-col w-full overflow-hidden min-h-100">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-aman-teal/10">
          <h2 className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            Historical Incident Archives
          </h2>
          <span className="text-[10px] text-cyan-700">TOTAL LOGS ANALYZED: 1,240</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <WeaponIncidentTable />
        </div>
      </div>
      
    </div>
  );
};

export default WeaponView;