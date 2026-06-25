import Chart from "../../../../shared/ui/molecules/CircleChart";
import { useCrimePercentage } from "../../hooks/useCrimePer";

const Crimetype = () => {
  const { CrimePercentage, isError, isLoading } = useCrimePercentage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-40 text-red-400">
        Failed to load data
      </div>
    );
  }

  const weaponToday = Math.round(CrimePercentage?.weapon?.todayPercentage || 0);
  const weaponChange = Math.round(CrimePercentage?.weapon?.changePercentage || 0);

  const behaviorToday = Math.round(
    CrimePercentage?.behavior?.todayPercentage || 0
  );
  const behaviorChange = Math.round(
    CrimePercentage?.behavior?.changePercentage || 0
  );

  const fireToday = Math.round(CrimePercentage?.fire?.todayPercentage || 0);
  const fireChange = Math.round(CrimePercentage?.fire?.changePercentage || 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {/* Weapon */}
        <div
          className="flex flex-col items-center rounded-xl px-2 relative overflow-hidden"
          style={{ borderTop: "3px solid #14B8A6" }}
        >
          <Chart
            value={weaponToday}
            label={`${weaponToday}%`}
            mainColor="#14B8A6"
          />

          <div className="flex flex-col gap-1 justify-center items-center">
            <p className="text-xs font-medium font-montserrat text-white pb-1">
              Weapon
            </p>
            <span
              className="text-[10px]"
              style={{ color: "#9FCFBE" }}
            >
              {weaponChange}% Change Compared to yesterday
            </span>
          </div>
        </div>

        {/* Behavior */}
        <div
          className="flex flex-col items-center rounded-xl px-2 relative overflow-hidden"
          style={{ borderTop: "3px solid #E09A3D" }}
        >
          <Chart
            value={behaviorToday}
            label={`${behaviorToday}%`}
            mainColor="#E09A3D"
          />

          <p className="text-xs font-medium font-montserrat text-white pb-1">
            Behavior
          </p>

          <div className="flex flex-col gap-1 justify-center items-center">
            <span
              className="text-[10px]"
              style={{ color: "#F0C87A" }}
            >
              {behaviorChange}% Change Compared to yesterday
            </span>
          </div>
        </div>

        {/* Fire */}
        <div
          className="flex flex-col items-center rounded-xl px-2 relative overflow-hidden"
          style={{ borderTop: "3px solid #EF4444" }}
        >
          <Chart
            value={fireToday}
            label={`${fireToday}%`}
            mainColor="#EF4444"
          />

          <p className="text-xs font-medium font-montserrat text-white pb-1">
            Fire
          </p>

          <div className="flex flex-col gap-1 justify-center items-center">
            <span
              className="text-[10px]"
              style={{ color: "#F5A5A5" }}
            >
              {fireChange}% Change Compared to yesterday
            </span>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="rounded-xl p-5 py-2.5">
        <div
          className="h-1 rounded-full overflow-hidden flex"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <div
            style={{
              width: `${weaponChange}%`,
              background: "#14B8A6",
              borderRadius: "999px 0 0 999px",
            }}
          />

          <div
            style={{
              width: `${behaviorChange}%`,
              background: "#E09A3D",
            }}
          />

          <div
            style={{
              width: `${fireChange}%`,
              background: "#EF4444",
              borderRadius: "0 999px 999px 0",
            }}
          />
        </div>

        <div className="flex gap-3 mt-1.5">
          <span
            className="text-[10px] flex items-center gap-1"
            style={{ color: "#9FE1CB" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#14B8A6" }}
            />
            Weapon
          </span>

          <span
            className="text-[10px] flex items-center gap-1"
            style={{ color: "#FAC775" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#E09A3D" }}
            />
            Behavior
          </span>

          <span
            className="text-[10px] flex items-center gap-1"
            style={{ color: "#F7C1C1" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#EF4444" }}
            />
            Fire
          </span>
        </div>
      </div>
    </div>
  );
};

export default Crimetype;