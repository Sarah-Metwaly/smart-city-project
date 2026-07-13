// import { useMemo } from 'react';
// import { useActivePower } from '../../energy-optimization/hooks/useActivePower';
// import LineChart from './../../../shared/ui/molecules/LineChart';

// interface DayData {
//   date: string;
//   total_energy: number;
//   total_cost: number;
// }

// // Generates the last 7 calendar days ending today, oldest first.
// // All days get mock data except Sunday, which is overridden with live TotalPower below.
// const buildMockWeek = (): DayData[] => {
//   const days: DayData[] = [];
//   const today = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);

//     days.push({
//       date: d.toISOString(),
//       total_energy: Math.floor(Math.random() * 40) + 20, // mock 20–60 KWH
//       total_cost: Math.floor(Math.random() * 15) + 5,     // mock 5–20 $
//     });
//   }

//   return days;
// };

// const Energy = () => {
//   const { TotalPower } = useActivePower();

//   const mockWeek = useMemo(() => buildMockWeek(), []);

//   const weeklyData = useMemo(() => {
//     return mockWeek.map((day) => {
//       const isSunday = new Date(day.date).getDay() === 0;
//       return isSunday ? { ...day, total_energy: TotalPower } : day;
//     });
//   }, [mockWeek, TotalPower]);

//   const maxDay = useMemo(
//     () => weeklyData.reduce((max, d) => (d.total_energy > max.total_energy ? d : max), weeklyData[0]),
//     [weeklyData]
//   );

//   const chartData = weeklyData.map((day) => {
//     const dayName = new Date(day.date)
//       .toLocaleDateString("en-US", { weekday: "short" })
//       .toUpperCase();

//     return {
//       label: dayName,
//       value: day.total_energy,
//     };
//   });

//   return (
//     <div className="flex flex-col h-full">
//       <h4 className="text-aman-light font-inter text-xs uppercase tracking-widest mt-6">
//         Real-time Consumption Analysis
//       </h4>

//       <hr className="my-2 border-t-[0.5px] border-aman-white/20" />

//       <LineChart
//         data={chartData}
//         title="Daily Consumption"
//         color="rgba(88, 113, 125, 0.5)"
//       />

//       <p className="text-aman-light text-[10px] uppercase tracking-widest m-3">
//         You used the most energy on{" "}
//         <span className="font-bold text-white">
//           {new Date(maxDay.date).toLocaleDateString("en-US", { weekday: "long" })}
//         </span>{" "}
//         this week with <span className="font-bold text-white">{maxDay.total_energy} KWH</span>
//       </p>
//     </div>
//   );
// };

// export default Energy;
import { useWeeklySummary } from '../hooks/useEnergy';
import LineChart from './../../../shared/ui/molecules/LineChart';

const Energy = () => {
  const { data, isLoading, isError } = useWeeklySummary();

  if (isLoading) {
    return (
      <p className="text-aman-light/40 text-xs font-mono animate-pulse p-4">
        Loading consumption data...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-red-400 text-xs font-mono p-4">
        Failed to load energy data.
      </p>
    );
  }

  const { weeklyData, maxDay } = data;

  const chartData = weeklyData.map((day) => {
    const dayName = new Date(day.date)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    return {
      label: dayName,
      value: day.total_energy,
    };
  });

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-aman-light font-inter text-xs uppercase tracking-widest mt-6">
        Real-time Consumption Analysis
      </h4>

      <hr className="my-2 border-t-[0.5px] border-aman-white/20" />

      <LineChart
        data={chartData}
        title="Daily Consumption"
        color="rgba(88, 113, 125, 0.5)"
      />

      <p className="text-aman-light text-[10px] uppercase tracking-widest m-3">
        You used the most energy on{" "}
        <span className="font-bold text-white">
          {new Date(maxDay.date).toLocaleDateString("en-US", { weekday: "long" })}
        </span>{" "}
        this week with <span className="font-bold text-white">{maxDay.total_energy} KWH</span>
      </p>
    </div>
  );
};

export default Energy;