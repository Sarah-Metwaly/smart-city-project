import Card from "../../../shared/ui/molecules/Card";
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




export default function Behavior() {
  return (
    <div className="p-6   text-white">
      {/**Container**/}
      <div className="flex flex-col gap-6">
        
        {/* Row 1: Status Cards **/}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 p-2 shrink-0">
          {/* 1.  */}
          <Card
            icon={<HiLightningBolt size={22} />}
            trend="+2.5%"
            value="24"
            title="Behavior Alert Today"
            colorClass="text-[#E05A5A]"
          />

          {/* 2.  */}
          <Card
            icon={<MdOutlineLightbulb size={22} />}
            trend="94%"
            value="08"
            title="High incident"
            colorClass="text-[#1A8A80]"
          />

          {/* 3. TOTAL ENERGY */}
          <Card
            icon={<RiFlashlightFill size={22} />}
            trend="-1.2%"
            value="12"
            title="Active Alerts "
            colorClass="text-[#F4FEFE]"
          />

          {/* 4. TOTAL COST */}
          <Card
            icon={<FaDollarSign size={20} />}
            trend="+$140"
            value="03"
            title="Active Alerts"
            colorClass="text-[#E09A3D]"
          />
        </div>

        {/* Row 2: Camera + Active Alerts  */}
        <div className="grid grid-cols-12 gap-6">
            {/*Camera card*/}
          <div className="col-span-8">
             <div className="aspect-video w-full bg-black rounded-lg border border-slate-700">
                <CameraCard id={1} title="Main Camera" isOnline={true} />
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