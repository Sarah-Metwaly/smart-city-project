import type { ActiveView } from "../../types/admin.types";
import { HiMenuAlt3 } from "react-icons/hi";

interface DashboardHeaderProps {
  activeView: ActiveView;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardHeader({
  activeView,
  setSidebarOpen,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-[#0a0e1a]">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white"
        >
          <HiMenuAlt3 size={24} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-white capitalize truncate">
            {activeView.replace("-", " ")}
          </h1>

          <p className="text-xs text-gray-500 truncate">
            Smart City Management System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-semibold">
          AD
        </div>
      </div>
    </header>
  );
}