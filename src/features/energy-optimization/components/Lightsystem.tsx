import Chart from "../../../shared/ui/molecules/CircleChart";
import { useLightSystem } from "../hooks/useLightsytem";

const Lightsystem = () => {
  const { reading, isLightsOn, isFaulty, hasData } = useLightSystem();

  if (!hasData) {
    return <div className="text-white font-montserrat animate-pulse p-4">SYSTEM SYNCING...</div>;
  }

  const isOff = !isLightsOn && !isFaulty;

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
            value={isLightsOn ? 100 : 0}
            label="Active"
            mainColor="#14B8A6"
          />
          <p className="flex items-center font-light text-s font-montserrat text-white">
            Turned ON
          </p>
        </div>

        {/* OFF Chart */}
        <div className="flex flex-col gap-1 items-center justify-center">
          <Chart
            value={isOff ? 100 : 0}
            label="OFF"
            mainColor="#E09A3D"
          />
          <p className="flex items-center font-light text-s font-montserrat text-white">
            Turned Off
          </p>
        </div>

        {/* Faulty Chart */}
        <div className="flex flex-col gap-1 items-center justify-center">
          <Chart
            value={isFaulty ? 100 : 0}
            label="Faulty"
            mainColor="#EF4444"
          />
          <p className="flex items-center justify-center font-light text-s font-montserrat text-white">
            Faulty
          </p>
        </div>
      </div>

      {reading?.power !== undefined && (
        <p className="text-center text-xs text-white/50 mt-2">
          Power: {reading.power}W
        </p>
      )}
    </div>
  );
};

export default Lightsystem;