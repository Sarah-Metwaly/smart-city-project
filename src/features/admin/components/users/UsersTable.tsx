import type { User, ActiveView } from '../../types/admin.types';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  activeView: ActiveView;

  onSelectUser: (user: User) => void;
  onToggleUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTable({
  users,
  loading,
  activeView,
  onSelectUser,
  onToggleUser,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="bg-[#0d1120] border border-white/5 rounded-xl overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              {activeView === 'officers' && (
                <th className="text-left px-4 py-3 font-medium">Badge</th>
              )}
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-white/2 transition-colors cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-medium flex-shrink-0">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">
                        {user.fullName}
                      </p>
                      <p className="text-gray-600 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 capitalize">
                    {user.role}
                  </span>
                </td>
                {activeView === 'officers' && (
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    {user.badgeNumber ?? '—'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.isActive
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-red-400 bg-red-400/10'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onToggleUser(user)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        user.isActive
                          ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10'
                          : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onDeleteUser(user._id)}
                      className="text-xs px-2.5 py-1 rounded-md border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
