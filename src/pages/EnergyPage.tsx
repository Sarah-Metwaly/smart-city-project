import ActivePower from "../features/energy-optimization/components/ActivePower";
import { MdOutlineLightbulb } from "react-icons/md"; // لـ Active Street Lights
import { RiFlashlightFill } from "react-icons/ri"; // لـ TOTAL ENERGY
import { FaDollarSign } from "react-icons/fa"; // لـ TOTAL COST
import {
  HiArrowUp,
  HiArrowDown,
  HiMinus,
  HiLightningBolt,
} from "react-icons/hi";
import Lightsystem from "../features/energy-optimization/components/Lightsystem";
import Card from "../shared/ui/atoms/Card";
import Energy from "../features/energy-optimization/components/Energy";
import { useLightSystem } from "../features/energy-optimization/hooks/useLightsytem";
import { useTotalData } from "../shared/hooks/useTotalData";

const renderTrend = (comment?: string) => {
  const status = comment?.toUpperCase();

  if (!status) return <span className="opacity-50">—</span>;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-[10px] font-bold uppercase text-[10px] ${
        status === "HIGH"
          ? "bg-red-500/20 text-red-500"
          : status === "LOW"
          ? "bg-green-500/20 text-green-500"
          : "bg-gray-500/20 text-gray-400"
      }`}
    >
      {status === "HIGH" && <HiArrowUp size={12} />}
      {status === "LOW" && <HiArrowDown size={12} />}
      {status === "NORMAL" && <HiMinus size={12} />}

      <span>{status}</span>
    </div>
  );
};

const EnergyPage = () => {
  const { sensorData, isLoading, isError, getPercentage } = useLightSystem();
  const { Total, trend, isTotalLoading, isTotalError } = useTotalData();

  //function to get trend style

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#182B31_46%,#0D1218_65%)] flex flex-col pt-20 md:p-23">
      <div className=" mx-auto px-6 lg:px-20  gap-5 flex-1 flex flex-col">
        {/*********************************Cards section********************************** */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 p-2 shrink-0">
          {/* 1. Total Active Load */}
          <Card
            icon={<HiLightningBolt size={22} />}
            trend={renderTrend(trend?.avgPowerComment)}
            value={`${Total?.totalActiveLoad ?? 0} W`}
            title="Total Active Load"
            colorClass="text-[#E05A5A]"
          />

          {/* 2. Active Street Lights */}
          <Card
            icon={<MdOutlineLightbulb size={22} />}
            trend={
              <div className="bg-aman-blue/20 text-aman-white px-2 py-1 rounded-[10px] text-[11px] font-bold">
                {`${getPercentage(sensorData?.on)}%`}
              </div>
            }
            value={`${sensorData?.on ?? 0} / ${sensorData?.total ?? 0} `}
            title="Active Street Lights"
            colorClass="text-[#1A8A80]"
          />

          {/* 3. TOTAL ENERGY */}
          <Card
            icon={<RiFlashlightFill size={22} />}
            trend={renderTrend(trend?.energyChangeComment)}
            value={`${Total?.totalEnergy ?? 0} KW`}
            title="Total Energy"
            colorClass="text-[#F4FEFE]"
          />

          {/* 4. TOTAL COST */}
          <Card
            icon={<FaDollarSign size={20} />}
            trend={renderTrend(trend?.costChangeComment)}
            value={`${Total?.totalCost ?? 0} $`}
            title="Total Cost"
            colorClass="text-[#E09A3D]"
          />
        </div>

        {/************** * Row 2: Charts Section  ******************/}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* LEFT SIDE: Two charts stacked vertically */}
          <div className="col-span-1 md:col-span-7 flex flex-col gap-3">
            {/*************** * Chart 1 (ACTIVE POWER) ********************************/}
            <div className=" bg-aman-teal rounded-xl border border-aman-blue p-4 backdrop-blur-md">
              <ActivePower />
            </div>

            {/****************************  Chart 2 (LIGHT SYSTEM) ******************/}
            <div className=" bg-aman-dark shadow-aman-light rounded-xl border border-aman-blue p-4 backdrop-blur-md">
              <Lightsystem />
            </div>
          </div>

          {/**************** RIGHT SIDE: ENERGY********************/}
          <div className="col-span-1 md:col-span-5 ">
            <div className="bg-aman-teal rounded-xl border border-aman-blue px-4 backdrop-blur-md flex  items-center flex-1">
              <Energy />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyPage;
