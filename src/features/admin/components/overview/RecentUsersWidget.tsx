import type { User } from "../../types/admin.types";

interface Props {
  users: User[];
}

export default function RecentUsersWidget({ users }: Props) {
  return (
    <div className="bg-[#0d1120] border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        Recent Users
      </h3>

      <div className="space-y-2">
        {users.slice(0, 5).map((u) => (
          <div key={u._id} className="flex items-center gap-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-medium flex-shrink-0">
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
              className={`text-xs px-2 py-0.5 rounded-full ${
                u.isActive
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-red-400 bg-red-400/10"
              }`}
            >
              {u.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}