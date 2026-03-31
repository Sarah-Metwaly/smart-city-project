import Chart from "../../../shared/ui/molecules/PieChart";
import { useLightSystem } from "../hooks/useLightsytem";


const Lightsystem = () => {
 
  const { sensorData, isLoading, isError, getPercentage } = useLightSystem();

 
  if (isLoading) {
    return <div className="text-white font-montserrat animate-pulse p-4">SYSTEM SYNCING...</div>;
  }

 
  if (isError) {
    return <div className="text-red-400 font-montserrat p-4 text-xs">SIGNAL LOST: CHECK CONNECTION</div>;
  }

  return (
    <div>
      <h4 className="text-aman-light font-inter text-xs uppercase tracking-widest mb-1">
        Street Lighting System
      </h4>
      <hr className="my-2 border-t-[0.5px] border-aman-white/20"></hr>
      
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-around">
        {/* Active Chart */}
        <div className="flex flex-col gap-1 items-center justify-center">
          <Chart 
            value={getPercentage(sensorData?.on)} 
            label="Active" 
            mainColor="#14B8A6" 
          />
          <p className="flex items-center font-light text-s font-montserrat text-white">
            Turned ON ({sensorData?.on})
          </p>
        </div>

        {/* OFF Chart */}
        <div className="flex flex-col gap-1 items-center justify-center">
          <Chart 
            value={getPercentage(sensorData?.off)} 
            label="OFF" 
            mainColor="#E09A3D" 
          />
          <p className="flex items-center font-light text-s font-montserrat text-white">
            Turned Off ({sensorData?.off})
          </p>
        </div>

        {/* Faulty Chart */}
        <div className="flex flex-col gap-1 items-center justify-center">
          <Chart 
            value={getPercentage(sensorData?.faulty)} 
            label="Faulty" 
            mainColor="#EF4444" 
          />
          <p className="flex items-center justify-center font-light text-s font-montserrat text-white">
            Inactive ({sensorData?.faulty})
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightsystem;