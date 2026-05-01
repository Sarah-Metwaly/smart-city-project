import Chart from "../../../../shared/ui/molecules/CircleChart";


const total = 35;

const Crimetype = () => {
  return (
    <div className="">
      <div className="grid grid-cols-3 gap-2">

        {/* Weapon */}
        <div className="flex flex-col  items-center rounded-xl px-2 relative overflow-hidden"
          style={{ borderTop: '3px solid #14B8A6' }}>
          <Chart 
            value={10} 
            label={`${Math.round((10 / total) * 100)}%`} 
            mainColor="#14B8A6" 
          />
          <div className="flex flex-col gap-1 justify-center items-center">
             <p className="text-xs font-medium font-montserrat text-white pb-1">Weapon</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}>Low risk</span>
          <span className="text-[10px]" style={{ color: '#9FCFBE' }}>↓ -3% this week</span>
          </div>
         
        </div>

        {/* Behavior */}
        <div className="flex flex-col items-center rounded-xl px-2  relative overflow-hidden"
          style={{ borderTop: '3px solid #E09A3D' }}>
          <Chart 
            value={20} 
            label={`${Math.round((20 / total) * 100)}%`} 
            mainColor="#E09A3D" 
          />
          <p className="text-xs font-medium font-montserrat text-white pb-1">Behavior</p>
          <div className="flex flex-col gap-1 justify-center items-center">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#FAEEDA', color: '#854F0B' }}>Medium risk</span>
          <span className="text-[10px]" style={{ color: '#F0C87A' }}>↑ +8% this week</span>
          </div>
        </div>

        {/* Fire */}
        <div className="flex flex-col  items-center rounded-xl px-2  relative overflow-hidden"
          style={{ borderTop: '3px solid #EF4444' }}>
          <Chart 
            value={5} 
            label={`${Math.round((5 / total) * 100)}%`} 
            mainColor="#EF4444" 
          />
          <p className="text-xs font-medium font-montserrat text-white pb-1">Fire</p>
          <div className="flex flex-col gap-1 justify-center items-center">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#FCEBEB', color: '#A32D2D' }}>High risk</span>
          <span className="text-[10px]" style={{ color: '#F5A5A5' }}>↓ -1% this week</span>
          </div>
        </div>

      </div>

      {/* Summary Bar */}
      <div className="rounded-xl p-5 py-2.5 ">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] text-white/60">Total incidents</span>
          <span className="text-[11px] font-medium text-white">{total}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden flex" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <div style={{ width: '28.57%', background: '#14B8A6', borderRadius: '999px 0 0 999px' }}></div>
          <div style={{ width: '57.14%', background: '#E09A3D' }}></div>
          <div style={{ width: '14.29%', background: '#EF4444', borderRadius: '0 999px 999px 0' }}></div>
        </div>
        <div className="flex gap-3 mt-1.5">
          <span className="text-[10px] flex items-center gap-1" style={{ color: '#9FE1CB' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#14B8A6' }}></span>Weapon
          </span>
          <span className="text-[10px] flex items-center gap-1" style={{ color: '#FAC775' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#E09A3D' }}></span>Behavior
          </span>
          <span className="text-[10px] flex items-center gap-1" style={{ color: '#F7C1C1' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#EF4444' }}></span>Fire
          </span>
        </div>
      </div>
    </div>
  );
};

export default Crimetype;