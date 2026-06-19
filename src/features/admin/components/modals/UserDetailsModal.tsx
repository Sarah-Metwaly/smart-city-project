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
    <>
      {user && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => onClose()}
        >
          <div
            className="bg-[#0d1120] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-lg text-blue-400 font-semibold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onClose()}
                className="text-gray-600 hover:text-gray-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

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
                [
                  'Joined',
                  new Date(user.createdAt).toLocaleDateString(),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-200 text-right max-w-[60%] truncate">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-5">
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
      )}
    </>
  );
}
