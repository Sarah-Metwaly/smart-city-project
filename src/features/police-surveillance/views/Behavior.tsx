import DispatchBoard from '../components/BehaviorComponent/Dispatch';
import StatCards from '../../../shared/ui/organisms/StatCards';
import { Activity, ShieldAlert, Siren, CheckCircle2,EyeOff,Eye} from "lucide-react";
import BehaviorActiveAlerts from '../components/BehaviorComponent/BehaviorActiveAlerts';
import BehaviorIncidents from '../components/BehaviorComponent/BehaviorTable';
import { useIncidents } from '../../../shared/hooks/useIncidentTable';
import LiveStream from '../../../shared/ui/organisms/CameraFeed';



export default function Behavior() {
 const { Incidents, isLoading, isError } = useIncidents("/api/v1/incidents/DailyIncidents?type=MEDICAL_EMERGENCY&type=CROWD_MANAGEMENT&type=THEFT_DETECTION&type=BEHAVIOR_ANOMALY");
  const total    = Incidents?.length ?? 0;
  const high     = Incidents?.filter((i) => i.priority === "HIGH").length ?? 0;
  const active   = Incidents?.filter((i) => i.status?.toUpperCase() === "ACTIVE").length ?? 0;
  const resolved = Incidents?.filter((i) => i.status?.toUpperCase() === "RESOLVED").length ?? 0;

 

const BehaviorStats = [
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
    icon: Siren,  
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
    <div className="p-6   text-white">
      {/**Container**/}
      <div className="flex flex-col gap-6">
        {/* Row 1: Status Cards **/}
        {/* 1. TOP STATS CARDS */}
        <StatCards stats={BehaviorStats} />

        {/* Row 2: Camera + Active Alerts  */}
        <div className="grid grid-cols-12 gap-3 h-95">
          {/*Camera card*/}
          <div className="col-span-9">
            {/* Live Camera Feed */}
            <LiveStream/>
          </div>
          {/* Active Alerts */}
          <div className="col-span-3 flex flex-col ">
            <BehaviorActiveAlerts />
          </div>
        </div>

        {/* Row 3: Behavior Table */}
        <div className="w-full">
          <p className="text-sm font-bold border-b border-slate-700 pb-2 mb-4">
            Weapon Events Log
          </p>
          <BehaviorIncidents />
        </div>

        {/* Row 4: Live Alerts + Chart */}
        <div className="">
          <div className=" bg-[#1a2c2f] rounded-lg border border-slate-800 ">
            <DispatchBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
