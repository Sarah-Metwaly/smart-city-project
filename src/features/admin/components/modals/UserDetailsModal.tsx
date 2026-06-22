import type { User } from '../../types/admin.types';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
  onToggleUser: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserDetailsModal({
  user,
  onClose,
  onToggleUser,
  onDelete,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1120] border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-base sm:text-lg text-blue-400 font-semibold flex-shrink-0">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-white truncate">
                {user.fullName}
              </p>
              <p className="text-sm text-gray-500 capitalize truncate">
                {user.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 text-xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {[
            ['Email', user.email],
            ['Status', user.isActive ? 'Active' : 'Inactive'],
            ['Email Verified', user.isEmailVerified ? 'Yes' : 'No'],
            ['Department', user.department ?? '—'],
            ['Badge', user.badgeNumber ?? '—'],
            [
              'Last Login',
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : '—',
            ],
            ['Joined', new Date(user.createdAt).toLocaleDateString()],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 py-1.5 border-b border-white/5 last:border-0"
            >
              <span className="text-gray-500 shrink-0">{label}</span>
              <span className="text-gray-200 text-right max-w-[60%] sm:max-w-[70%] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={() => {
              onToggleUser(user);
              onClose();
            }}
            className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
              user.isActive
                ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10'
                : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={() => {
              onDelete(user._id);
              onClose();
            }}
            className="flex-1 py-2 text-sm rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}