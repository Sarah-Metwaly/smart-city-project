import type { User, Incident } from '../../types/admin.types';
import { MdReportProblem } from "react-icons/md";
import { TbUsers, TbUserCheck, TbAlertCircle, TbFlame } from "react-icons/tb";

interface OverviewViewProps {
  users: User[];
  incidents: Incident[];
}

export default function OverviewView({ users, incidents }: OverviewViewProps) {
  const colorMap = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE').length;
  const highPriority = incidents.filter((i) => i.priority === 'HIGH').length;

  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: users.length,
            color: 'blue',
            icon: <TbUsers size={16} /> ,
          },
          {
            label: 'Active Users',
            value: activeUsers,
            color: 'emerald',
            icon: <TbUserCheck size={16} />,
          },
          {
            label: 'Active Incidents',
            value: activeIncidents,
            color: 'amber',
            icon: <TbAlertCircle size={16} />,
          },
          {
            label: 'High Priority',
            value: highPriority,
            color: 'red',
            icon: <TbFlame size={16} />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0d1120] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-gray-500">{stat.label}</span>
              <span className={`${colorMap[stat.color]} text-sm`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
  );
}
