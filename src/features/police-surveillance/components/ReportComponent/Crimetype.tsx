import Chart from '../../../../shared/ui/molecules/CircleChart';
import { useCrimePercentage } from '../../hooks/useCrimePer';

const Crimetype = () => {
  const { CrimePercentage, isError, isLoading } = useCrimePercentage();

  if (isLoading) return (
    <div className="flex items-center justify-center w-full h-40 text-white rounded-2xl"
      style={{ background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)' }}>
      Loading...
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center w-full h-40 text-red-400 rounded-2xl"
      style={{ background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)' }}>
      Failed to load data
    </div>
  );

  const weaponToday    = Math.round(CrimePercentage?.weapon?.todayPercentage    || 0);
  const weaponChange   = Math.round(CrimePercentage?.weapon?.changePercentage   || 0);
  const behaviorToday  = Math.round(CrimePercentage?.behavior?.todayPercentage  || 0);
  const behaviorChange = Math.round(CrimePercentage?.behavior?.changePercentage || 0);
  const fireToday      = Math.round(CrimePercentage?.fire?.todayPercentage      || 0);
  const fireChange     = Math.round(CrimePercentage?.fire?.changePercentage     || 0);

  return (
    <div
      className="relative flex flex-col w-full h-full overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(150deg, #1E3A46 0%, #182B31 55%, #0d1e27 100%)',
        boxShadow: '0 0 0 1px rgba(88,113,125,0.18), 0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(180,195,204,0.35) 40%,rgba(88,113,125,0.4) 60%,transparent)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#fff 3px,#fff 4px)' }} />

      <div className="relative flex flex-col justify-between flex-1 min-h-0 gap-3 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
              <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-50 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500" />
            </span>
            <h2 className="text-xs font-semibold tracking-wide" style={{ color: '#F4FEFE' }}>
              Crime Type Percentage
            </h2>
          </div>
          <div className="h-px"
            style={{ background: 'linear-gradient(90deg,rgba(88,113,125,0.3),rgba(88,113,125,0.08),transparent)' }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          {[
            { value: weaponToday,   change: weaponChange,   color: '#14B8A6', label: 'Weapon',   textColor: '#9FCFBE' },
            { value: behaviorToday, change: behaviorChange, color: '#E09A3D', label: 'Behavior',  textColor: '#F0C87A' },
            { value: fireToday,     change: fireChange,     color: '#EF4444', label: 'Fire',      textColor: '#F5A5A5' },
          ].map(({ value, change, color, label, textColor }) => (
            <div
              key={label}
              className="relative flex flex-col items-center px-2 overflow-hidden rounded-xl"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <Chart value={value} label={`${value}%`} mainColor={color} />
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="pb-1 text-xs font-medium text-white font-montserrat">{label}</p>
                <span className="text-[10px] text-center" style={{ color: textColor }}>
                  {change}% vs yesterday
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full pt-2 mt-auto">
          <div className="grid w-full grid-cols-3 gap-4">
            {[
              { value: weaponToday,   color: '#14B8A6', label: 'Weapon',   textColor: '#9FE1CB' },
              { value: behaviorToday, color: '#E09A3D', label: 'Behavior', textColor: '#FAC775' },
              { value: fireToday,     color: '#EF4444', label: 'Fire',     textColor: '#F7C1C1' },
            ].map(({ value, color, label, textColor }) => (
              <div key={label} className="flex flex-col items-center w-full gap-2">
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${value}%`, background: color }}
                  />
                </div>
                <span className="text-[10px] flex items-center gap-1.5 justify-center text-center" style={{ color: textColor }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                    style={{ background: color, boxShadow: `0 0 4px ${color}88` }} />
                  {label} ({value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(88,113,125,0.2),transparent)' }} />
    </div>
  );
};

export default Crimetype;