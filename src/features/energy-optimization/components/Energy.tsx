import { useWeeklySummary } from '../hooks/useEnergy';
import LineChart from './../../../shared/ui/molecules/LineChart';

const Energy = () => {
  // Fetching data from the custom hook
  const { data, isLoading, isError } = useWeeklySummary();

  //  Transforms the API date into  day names
  const chartData = data?.weeklyData.map((day) => {
    const dayName = new Date(day.date)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    return {
      label: dayName,
      value: day.total_energy,
    };
  }) || [];

  // Handling loading and error states for a better UX
  if (isLoading) return <div className="p-5 text-white">Loading analysis...</div>;
  if (isError) return <div className="p-5 text-red-500">Failed to load energy data.</div>;

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-aman-light font-inter text-xs uppercase tracking-widest mt-6">
        Real-time Consumption Analysis
      </h4>
      
      <hr className="my-2 border-t-[0.5px] border-aman-white/20" />

      {/* The LineChart receives the dynamic chartData */}
      <LineChart 
        data={chartData} 
        title="Daily Consumption" 
        color="rgba(88, 113, 125, 0.5)" 
      />

      <p className="text-aman-light text-[10px] uppercase tracking-widest m-3">
        {/* maxDay is used here to show the peak energy day dynamically */}
        You used the most energy on{" "}
        <span className="font-bold text-white">
          {new Date(data?.maxDay.date || "").toLocaleDateString("en-US", { weekday: "long" })}
        </span>{" "}
        this week with <span className="font-bold text-white">{data?.maxDay.total_energy} KWH</span>
      </p>
    </div>
  );
};

export default Energy;