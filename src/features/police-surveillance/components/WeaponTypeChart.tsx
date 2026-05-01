import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface WeaponData {
  id: number;
  value: number;
  label: string;
  color: string; 
}

interface WeaponChartProps {
  data: WeaponData[];
}

export const WeaponTypeChart: React.FC<WeaponChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col h-full p-5 border bg-aman-dark border-aman-teal rounded-2xl">
      {/* العنوان */}
      <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-4">
        Weapon Types Detected
      </h3>

      <div className="flex items-center gap-6">
        {/* الرسم البياني الدائري */}
        <div className="w-28 h-28">
          <PieChart
            series={[
              {
                data: data.map((item) => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                })),
                innerRadius: 35,
                outerRadius: 55,
                paddingAngle: 2,
              },
            ]}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            sx={{
              '.MuiChartsLegend-root': { display: 'none' },
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-gray-300">{item.label}</span>
              </div>
              <span className="text-[11px] font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4 mt-6 border-t border-white/10">
        <span className="text-[10px] text-gray-500 uppercase">Total</span>
        <span className="text-[12px] font-bold text-white">{total}</span>
      </div>
    </div>
  );
};

export default WeaponTypeChart;
