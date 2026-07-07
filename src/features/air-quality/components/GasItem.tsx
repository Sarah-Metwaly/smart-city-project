import { normalizeLevel } from "../helpers";
import { statusStyles, statusFill, gasBarWidth } from "../constants";

export function GasItem({ name, value, level }: { name: string; value: string; level: string }) {
  const status = normalizeLevel(level);
  const textColor = statusStyles[status].value;

  return (
    <div className="bg-aman-teal rounded-lg p-3">
      <p className="text-[10px] text-[#58717D] mb-1.5">{name}</p>
      <p className={`text-[15px] font-semibold mb-1.5 ${textColor}`}>{value}</p>
      <div className="bg-[#182B31] h-[3px] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${statusFill[status]} ${gasBarWidth[status]}`} />
      </div>
    </div>
  );
}