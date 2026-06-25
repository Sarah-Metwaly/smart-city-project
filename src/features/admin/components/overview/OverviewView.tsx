import type { User, Incident } from '../../types/admin.types';
import {
  TbUsers,
  TbUserCheck,
  TbAlertCircle,
  TbFlame,
} from 'react-icons/tb';

interface OverviewViewProps {
  users: User[];
  incidents: Incident[];
}

export default function OverviewView({
  users,
  incidents,
}: OverviewViewProps) {
  const colorMap = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const activeIncidents = incidents.filter(
    (i) => i.status === 'ACTIVE'
  ).length;
  const highPriority = incidents.filter(
    (i) => i.priority === 'HIGH'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[
        {
          label: 'Total Users',
          value: users.length,
          color: 'blue',
          icon: <TbUsers size={18} />,
        },
        {
          label: 'Active Users',
          value: activeUsers,
          color: 'emerald',
          icon: <TbUserCheck size={18} />,
        },
        {
          label: 'Active Incidents',
          value: activeIncidents,
          color: 'amber',
          icon: <TbAlertCircle size={18} />,
        },
        {
          label: 'High Priority',
          value: highPriority,
          color: 'red',
          icon: <TbFlame size={18} />,
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-[#0d1120] border border-white/5 rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-500">
              {stat.label}
            </span>

            <span
              className={`${colorMap[stat.color]} text-base flex-shrink-0`}
            >
              {stat.icon}
            </span>
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}