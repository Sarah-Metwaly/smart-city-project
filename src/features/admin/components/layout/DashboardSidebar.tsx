import type { ActiveView } from '../../types/admin.types';
import { navItems } from '../../constants/admin.constants';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";

interface DashboardSidebarProps {
  activeView: ActiveView;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

export default function DashboardSidebar({
  activeView,
  sidebarOpen,
  setSidebarOpen,
  setActiveView,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`${
        sidebarOpen ? 'w-60' : 'w-16'
      } flex-shrink-0 bg-[#0d1120] border-r border-white/5 flex flex-col transition-all duration-300`}
    >

      <div className="flex items-center px-4 py-5 border-b border-white/5">
        {sidebarOpen ? (
          <>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white-400 text-lg font-bold"><TbBuildingSkyscraper size={18} className="text-blue-400" /></span>
            </div>

            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white leading-tight">
                Smart City
              </p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg ml-auto text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              <FaAngleLeft className="text-white" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 mx-auto rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
          >
            <FaAngleRight className="text-white" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              activeView === item.id
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">
              {item.icon}
            </span>
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-gray-600">Admin Dashboard v1.0</p>
        </div>
      )}
    </aside>
  );
}
