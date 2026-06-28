import Chart from '../../../../shared/ui/molecules/CircleChart';
import { useCrimePercentage } from '../../hooks/useCrimePer';

const Crimetype = () => {
  const { CrimePercentage, isError, isLoading } = useCrimePercentage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-40 text-red-400">
        Failed to load data
      </div>
    );
  }

  const weaponToday = Math.round(CrimePercentage?.weapon?.todayPercentage || 0);
  const weaponChange = Math.round(
    CrimePercentage?.weapon?.changePercentage || 0,
  );

  const behaviorToday = Math.round(
    CrimePercentage?.behavior?.todayPercentage || 0,
  );
  const behaviorChange = Math.round(
    CrimePercentage?.behavior?.changePercentage || 0,
  );

  const fireToday = Math.round(CrimePercentage?.fire?.todayPercentage || 0);
  const fireChange = Math.round(CrimePercentage?.fire?.changePercentage || 0);

  return (
    <div
      className="relative flex flex-col w-full h-full overflow-hidden rounded-2xl"
      style={{
        background:
          'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow:
          '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)',
        }}
      />

      <div className="relative flex flex-col justify-between flex-1 h-full min-h-0 gap-3 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
                <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-50 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500" />
              </span>
              <h2
                className="text-xs font-semibold tracking-wide"
                style={{ color: '#F4FEFE' }}
              >
                Crime Type Percentage
              </h2>
            </div>
          </div>

          <div
            className="h-px"
            style={{
              background:
                'linear-gradient(90deg,rgba(88,113,125,0.3),rgba(88,113,125,0.08),transparent)',
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div
            className="relative flex flex-col items-center px-2 overflow-hidden rounded-xl"
            style={{ borderTop: '3px solid #14B8A6' }}
          >
            <Chart
              value={weaponToday}
              label={`${weaponToday}%`}
              mainColor="#14B8A6"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="pb-1 text-xs font-medium text-white font-montserrat">
                Weapon
              </p>
              <span
                className="text-[10px] text-center"
                style={{ color: '#9FCFBE' }}
              >
                {weaponChange}% vs yesterday
              </span>
            </div>
          </div>

          <div
            className="relative flex flex-col items-center px-2 overflow-hidden rounded-xl"
            style={{ borderTop: '3px solid #E09A3D' }}
          >
            <Chart
              value={behaviorToday}
              label={`${behaviorToday}%`}
              mainColor="#E09A3D"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="pb-1 text-xs font-medium text-white font-montserrat">
                Behavior
              </p>
              <span
                className="text-[10px] text-center"
                style={{ color: '#F0C87A' }}
              >
                {behaviorChange}% vs yesterday
              </span>
            </div>
          </div>

          <div
            className="relative flex flex-col items-center px-2 overflow-hidden rounded-xl"
            style={{ borderTop: '3px solid #EF4444' }}
          >
            <Chart
              value={fireToday}
              label={`${fireToday}%`}
              mainColor="#EF4444"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="pb-1 text-xs font-medium text-white font-montserrat">
                Fire
              </p>
              <span
                className="text-[10px] text-center"
                style={{ color: '#F5A5A5' }}
              >
                {fireChange}% vs yesterday
              </span>
            </div>
          </div>
        </div>

        {/* الهيكل السفلي المطور والموزع بالتوازي تحت الدوائر مباشرة */}
        <div className="w-full pt-2 mt-auto">
          <div className="grid w-full grid-cols-3 gap-4">
            {/* Weapon Segment */}
            <div className="flex flex-col items-center w-full gap-2">
              <div
                className="w-full h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${weaponToday}%`,
                    background: '#14B8A6',
                  }}
                />
              </div>
              <span
                className="text-[10px] flex items-center gap-1.5 justify-center text-center"
                style={{ color: '#9FE1CB' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                  style={{
                    background: '#14B8A6',
                    boxShadow: '0 0 4px #14B8A688',
                  }}
                />
                Weapon ({weaponToday}%)
              </span>
            </div>

            {/* Behavior Segment */}
            <div className="flex flex-col items-center w-full gap-2">
              <div
                className="w-full h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${behaviorToday}%`,
                    background: '#E09A3D',
                  }}
                />
              </div>
              <span
                className="text-[10px] flex items-center gap-1.5 justify-center text-center"
                style={{ color: '#FAC775' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                  style={{
                    background: '#E09A3D',
                    boxShadow: '0 0 4px #E09A3D88',
                  }}
                />
                Behavior ({behaviorToday}%)
              </span>
            </div>

            {/* Fire Segment */}
            <div className="flex flex-col items-center w-full gap-2">
              <div
                className="w-full h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${fireToday}%`,
                    background: '#EF4444',
                  }}
                />
              </div>
              <span
                className="text-[10px] flex items-center gap-1.5 justify-center text-center"
                style={{ color: '#F7C1C1' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                  style={{
                    background: '#EF4444',
                    boxShadow: '0 0 4px #EF444488',
                  }}
                />
                Fire ({fireToday}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg,transparent,rgba(88,113,125,0.2),transparent)',
        }}
      />
    </div>
  );
};

export default Crimetype;
