import type { ActiveView } from "../../types/admin.types";

interface DashboardHeaderProps {
  activeView: ActiveView;
}

export default function DashboardHeader({
  activeView,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0e1a]">
      <div>
        <h1 className="text-lg font-semibold text-white capitalize">
          {activeView.replace("-", " ")}
        </h1>

        <p className="text-xs text-gray-500 mt-0.5">
          Smart City Management System
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-semibold">
          AD
        </div>
      </div>
    </header>
  );
}