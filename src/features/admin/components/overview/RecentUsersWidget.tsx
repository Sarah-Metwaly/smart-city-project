import type { User } from '../../types/admin.types';
import { TbUsers } from 'react-icons/tb';

interface Props {
  users: User[];
}

export default function RecentUsersWidget({ users }: Props) {
  return (
    <div className="bg-[#0d1120] border border-white/5 rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
        <TbUsers size={16} className="text-gray-500 flex-shrink-0" />
        <span>Recent Users</span>
      </h3>

      <div className="space-y-2">
        {users.slice(0, 5).map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-3 py-2 min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-medium flex-shrink-0">
              {u.firstName[0]}
              {u.lastName[0]}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-200 truncate">
                {u.fullName}
              </p>

              <p className="text-xs text-gray-600 truncate">
                {u.email}
              </p>
            </div>

            <span
              className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                u.isActive
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-red-400 bg-red-400/10'
              }`}
            >
              {u.isActive ? 'Active' : 'Inactive'}
            </span>

            <div
              className={`sm:hidden w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                u.isActive
                  ? 'bg-emerald-400'
                  : 'bg-red-400'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}