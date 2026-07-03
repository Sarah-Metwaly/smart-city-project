import { AlertTriangle } from "lucide-react";

export function AirQualityError() {
  return (
    <div className="bg-[#0A0E14] p-5 rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[200px]">
      <div className="w-10 h-10 rounded-xl bg-[#E63946]/10 border border-[#E63946]/25 flex items-center justify-center">
        <AlertTriangle size={18} color="#E63946" />
      </div>
      <p className="text-sm text-[#B4C3CC] font-medium">Failed to load sensor data</p>
      <p className="text-[11px] text-[#58717D]">Check your connection and try again</p>
    </div>
  );
}


