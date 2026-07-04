import { PieChart } from "@mui/x-charts/PieChart";
import { useActivePower } from "../hooks/useActivePower";
import { useTotalData } from "../../../shared/hooks/useTotalData";
import { useFlameSensor } from "../../fire-department/hooks/useFlame";

const ActivePower = () => {
  const {
    LDRData,
    getPercent,
    DHT11Value,
    MQResponse,
    TotalPower
    
  } = useActivePower();
    const { flameSensorData} = useFlameSensor();


  const data = [
    {
      id: 0,
      label: "LDR",
      realValue:  LDRData?.power??0 ,
      value: getPercent( LDRData?.power??0),

      color: "#14B8A6",
    },
    {
      id: 1,
      label: "DHT11",
      realValue: DHT11Value?.power?? 0,
      value: getPercent(DHT11Value?.power ?? 0),

      color: "#3B82F6",
    },
    
    {
      id: 2,
      label: "MQ",
      realValue: MQResponse?.power ?? 0,
      value: getPercent(MQResponse?.power ?? 0),

      color: "#F59E0B",
    },
    {
      id: 3,
      label: "Flame",
      realValue: flameSensorData?.power??10,
      value: getPercent(flameSensorData?.power??10),

      color: "#FACC15",
    },
  ];

  return (
    <div>
      <h4 className="text-aman-light font-inter text-xs uppercase tracking-widest m-2">
        Active Power
      </h4>
      <hr className="my-2 border-t-[0.5px] border-aman-white/20"></hr>

      <div className="flex flex-col md:flex-row items-center justify-around  w-full">
        <div className="  relative flex items-center justify-center mx-7">
          <PieChart
            series={[
              {
                data: data,
                innerRadius: 50,
                outerRadius: 70,
                paddingAngle: 2,
                cornerRadius: 0,
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
            height={150}
            width={150}
          />
          {/* نص في منتصف الدائرة */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-aman-light text-[10px] uppercase tracking-widest">
              Total value
            </span>
            <span className="text-2xl font-black text-aman-white">
              {TotalPower}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/2 gap-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="group grid grid-cols-12 items-center p-1 rounded-xl hover:bg-white/10 transition-all border-b border-white/5 last:border-0"
            >
              {/* 1. Label Section (Takes 6 units) */}
              <div className="col-span-6 flex items-center gap-4">
                {/* Dot Indicator */}
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}88`, // Subtle glow matching Aman style
                  }}
                />
                <span className="text-aman-light font-inter text-[13px] group-hover:text-aman-white transition-colors cursor-pointer">
                  {item.label}
                </span>
              </div>

              {/* 2. Value Section (Takes 3 units) */}
              <div className="col-span-3 flex justify-end px-2">
                <span className="text-aman-light font-mono text-[13px] group-hover:text-aman-white transition-colors">
                  {item.realValue}
                </span>
              </div>

              {/* 3. Percentage Section (Takes 3 units) */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                <span className="text-aman-white font-mono font-bold text-[13px]">
                  {item.value}%
                </span>
                <span className="text-[9px] text-aman-blue uppercase tracking-widest opacity-60 hidden xs:inline">
                  Units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivePower;
