import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineLightbulb } from "react-icons/md";
import { RiFlashlightFill } from "react-icons/ri";
import { FaDollarSign } from "react-icons/fa";
import CameraCard from "../components/BehaviorComponent/CameraCard";
import ActiveAlerts from "../components/BehaviorComponent/ActiveAlerts";
import BehaviorTable from "../components/BehaviorComponent/BehaviorTable";
import AmanAssistantDesign from "../components/BehaviorComponent/AiAssistant";
import BehaviorType from "../components/BehaviorComponent/BehaviorType";
import DispatchBoard from "../components/BehaviorComponent/Dispatch";
import StatCards from "../../../shared/ui/organisms/StatCards";
import { AlertTriangle, Crosshair, Skull, Target, Activity } from "lucide-react";
import CameraFeed from "../../../shared/ui/organisms/CameraFeed";





export default function Behavior() {
  const weaponStats = [
    { title: "Major Alerts Today", value: "5", icon: AlertTriangle, badge: "ALERT", colorClass: { bg: "bg-aman-red/10", text: "text-red-500" } },
    { title: "Crime Rate", value: "12%", icon: Crosshair, badge: "RATE", colorClass: { bg: "bg-aman-cyan/10", text: "text-cyan-400" } },
    { title: "Armed Suspects", value: "4", icon: Target, badge: "SUSPECTS", colorClass: { bg: "bg-aman-orange/10", text: "text-orange-400" } },
    { title: "Danger Zones", value: "3", icon: Skull, badge: "DANGER", colorClass: { bg: "bg-aman-yellow/10", text: "text-yellow-400" } },
  ];
  return (
    <div className="p-6   text-white">
      {/**Container**/}
      <div className="flex flex-col gap-6">
        
        {/* Row 1: Status Cards **/}
         {/* 1. TOP STATS CARDS */}
      <StatCards stats={weaponStats} />


        {/* Row 2: Camera + Active Alerts  */}
        <div className="grid grid-cols-12 gap-6">
            {/*Camera card*/}
          <div className="col-span-8">
             {/* <div className="aspect-video w-full bg-black rounded-lg border border-slate-700">
                <CameraCard id={1} title="Main Camera" isOnline={true} />
             </div> */}
              {/* Live Camera Feed */}
        <div className="h-120"> 
          <CameraFeed 
            location="Main Square - Gate 4" 
            status="PROCESSING"
          />
        </div>
          </div>
          {/* Active Alerts */}
          <div className="col-span-4 flex flex-col gap-4">
             <ActiveAlerts/>
             </div>
        </div>

        {/* Row 3: Behavior Table */}
        <div className="w-full">
          <p className="text-sm font-bold border-b border-slate-700 pb-2 mb-4">Weapon Events Log</p>
          <BehaviorTable/>
        </div>

        {/* Row 4: Live Alerts + Chart */}
        <div className="">
          <div className=" bg-[#1a2c2f] rounded-lg border border-slate-800 ">
            <DispatchBoard/>
          </div>
         
          
        </div>

      </div>
    </div>
  );
}